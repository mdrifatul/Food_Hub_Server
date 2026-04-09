import { prisma } from "../../lib/prisma";

const getSearchSuggestions = async (query: string) => {
  if (!query || query.length < 1) {
    return [];
  }

  const [meals, categories] = await Promise.all([
    prisma.meal.findMany({
      where: {
        isAvailable: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { cuisine: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 6,
      select: { title: true, cuisine: true },
    }),
    prisma.category.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 2,
      select: { name: true },
    }),
  ]);

  const suggestions = new Set<string>();

  categories.forEach((cat) => suggestions.add(cat.name));

  meals.forEach((m) => {
    if (m.title) suggestions.add(m.title);
    if (m.cuisine) suggestions.add(m.cuisine);
  });

  return Array.from(suggestions).slice(0, 10);
};

const getRecommendations = async (userId?: string) => {
  let recommendedCategoryIds: string[] = [];

  if (userId) {
    const userOrders = await prisma.order.findMany({
      where: { authorId: userId },
      include: {
        items: {
          include: {
            meal: { select: { categoryId: true } },
          },
        },
      },
      take: 20,
    });

    if (userOrders.length > 0) {
      const catIds = userOrders.flatMap((order) =>
        order.items.map((item) => item.meal.categoryId).filter(Boolean),
      );
      recommendedCategoryIds = Array.from(new Set(catIds)) as string[];
    }
  }

  let trendingMeals = await prisma.meal.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      category: true,
    },
  });

  if (recommendedCategoryIds.length > 0) {
    const personalized = await prisma.meal.findMany({
      where: {
        isAvailable: true,
        categoryId: { in: recommendedCategoryIds },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        category: true,
      },
    });

    const combined = [...personalized, ...trendingMeals];
    const uniqueIds = new Set();

    trendingMeals = combined
      .filter((m) => {
        if (!uniqueIds.has(m.id)) {
          uniqueIds.add(m.id);
          return true;
        }
        return false;
      })
      .slice(0, 6);
  }
  return trendingMeals;
};

const getTrending = async () => {
  return await prisma.meal.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      category: true,
    },
  });
};

const chatWithAssistant = async (message: string) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error(
      "Gemini API key is missing. Please configure GEMINI_API_KEY in .env file.",
    );
  }

  // Fetch live data context for the AI
  const liveMeals = await prisma.meal.findMany({
    where: { isAvailable: true },
    take: 10,
    select: {
      title: true,
      price: true,
      cuisine: true,
      dietaryPreferences: true,
    },
  });

  const context = JSON.stringify(liveMeals);

  const systemPrompt = `You are a helpful AI assistant for FoodHub. 
  Here is some context about our available meals: ${context}.
  Answer the user's questions about food, meals, pricing, and recommendations. Keep responses concise.`;

  // Call the Gemini API Rest Endpoint directly
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.7,
        },
      }),
    },
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("Gemini Error: ", errText);
    throw new Error("Failed to communicate with Gemini API");
  }

  const data = await response.json();
  const reply =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I couldn't understand that.";

  return { reply };
};

export const AIService = {
  getSearchSuggestions,
  getRecommendations,
  getTrending,
  chatWithAssistant,
};
