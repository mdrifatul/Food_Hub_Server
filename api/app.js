// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

// generated/client/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/client/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": 'model ProviderProfile {\n  id       String @id @default(uuid())\n  authorId String\n\n  businessName    String\n  businessAddress String\n  businessPhone   String\n  description     String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("provider_profiles")\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role   String? @default("USER")\n  phone  String?\n  status String? @default("ACTIVE")\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nenum UserRole {\n  USER\n  PROVIDER\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  SUSPENDED\n  BANNED\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  name      String   @unique @db.VarChar(100)\n  slug      String   @unique @db.VarChar(100)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  meals     Meal[]\n\n  @@map("categories")\n}\n\nmodel Meal {\n  id                 String   @id @default(uuid())\n  title              String?  @db.VarChar(255)\n  price              Int\n  authorId           String\n  cuisine            String?\n  dietaryPreferences String[]\n\n  categoryId String?\n  category   Category? @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  imageUrl    String?\n  isAvailable Boolean  @default(true)\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n\n  orderItem OrderItem[]\n  review    Review[]\n\n  @@index([authorId])\n  @@map("meals")\n}\n\nmodel Order {\n  id String @id @default(uuid())\n\n  authorId        String\n  providerId      String\n  status          OrderStatus   @default(PENDING)\n  paymentMethod   PaymentMethod @default(COD)\n  deliveryAddress String\n\n  totalPrice Int\n\n  // Relations\n  items OrderItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([authorId])\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id       String @id @default(uuid())\n  orderId  String\n  order    Order  @relation(fields: [orderId], references: [id])\n  mealId   String\n  meal     Meal   @relation(fields: [mealId], references: [id])\n  quantity Int?\n  price    Int\n\n  @@index([orderId])\n  @@index([mealId])\n  @@map("order_items")\n}\n\nenum OrderStatus {\n  PENDING\n  PREPARING\n  READY\n  DELIVERED\n}\n\nenum PaymentMethod {\n  COD\n}\n\nmodel Review {\n  id        String   @id @default(uuid())\n  authorId  String\n  mealId    String\n  meal      Meal     @relation(fields: [mealId], references: [id], onDelete: Cascade)\n  rating    Int\n  comment   String?\n  createdAt DateTime @default(now())\n\n  @@index([mealId])\n  @@index([authorId])\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../generated/client"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"ProviderProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"businessName","kind":"scalar","type":"String"},{"name":"businessAddress","kind":"scalar","type":"String"},{"name":"businessPhone","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"provider_profiles"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"slug","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"meals","kind":"object","type":"Meal","relationName":"CategoryToMeal"}],"dbName":"categories"},"Meal":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"cuisine","kind":"scalar","type":"String"},{"name":"dietaryPreferences","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMeal"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"orderItem","kind":"object","type":"OrderItem","relationName":"MealToOrderItem"},{"name":"review","kind":"object","type":"Review","relationName":"MealToReview"}],"dbName":"meals"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"paymentMethod","kind":"enum","type":"PaymentMethod"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"totalPrice","kind":"scalar","type":"Int"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"orders"},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToOrderItem"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Int"}],"dbName":"order_items"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"mealId","kind":"scalar","type":"String"},{"name":"meal","kind":"object","type":"Meal","relationName":"MealToReview"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/client/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/client/enums.ts
var UserRole = {
  USER: "USER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
  BANNED: "BANNED"
};
var OrderStatus = {
  PENDING: "PENDING",
  PREPARING: "PREPARING",
  READY: "READY",
  DELIVERED: "DELIVERED"
};
var PaymentMethod = {
  COD: "COD"
};

// generated/client/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false
    // requireEmailVerification: true,
  },
  //   emailVerification: {
  //     sendOnSignIn: true,
  //     autoSignInAfterVerification: true,
  //     sendVerificationEmail: async ({ user, url, token }, request) => {
  //       try {
  //         const VerificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
  //         const info = await transporter.sendMail({
  //           from: '"Prisma Blog" <prismablog@gmail.com>',
  //           to: `rifatulislam987@gmail.com`,
  //           subject: "Please verify you email",
  //           html: `<!DOCTYPE html>
  // <html lang="en">
  //   <head>
  //     <meta charset="UTF-8" />
  //     <title>Verify Your Email</title>
  //   </head>
  //   <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  //     <table width="100%" cellpadding="0" cellspacing="0">
  //       <tr>
  //         <td align="center" style="padding:40px 0;">
  //           <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
  //             <!-- Header -->
  //             <tr>
  //               <td style="background:#2563eb; padding:20px; text-align:center;">
  //                 <h1 style="color:#ffffff; margin:0; font-size:24px;">
  //                   Prisma Blog
  //                 </h1>
  //               </td>
  //             </tr>
  //             <!-- Content -->
  //             <tr>
  //               <td style="padding:30px; color:#333333;">
  //                 <h2 style="margin-top:0;">Verify your email address</h2>
  //                 <p>Hello ${user.name}</p>
  //                 <p style="font-size:15px; line-height:1.6;">
  //                   Thanks for signing up for Prisma Blog. Please confirm your email address to activate your account.
  //                 </p>
  //                 <div style="text-align:center; margin:30px 0;">
  //                   <a
  //                     href="${VerificationUrl}"
  //                     style="
  //                       background:#2563eb;
  //                       color:#ffffff;
  //                       text-decoration:none;
  //                       padding:12px 24px;
  //                       border-radius:6px;
  //                       font-weight:bold;
  //                       display:inline-block;
  //                     "
  //                   >
  //                     Verify Email
  //                   </a>
  //                 </div>
  //                 <p style="font-size:14px; line-height:1.6;">
  //                   If the button doesn’t work, copy and paste this link into your browser:
  //                 </p>
  //                 <p style="font-size:13px; word-break:break-all; color:#2563eb;">
  //                   ${VerificationUrl}
  //                 </p>
  //                 <p style="font-size:14px; line-height:1.6;">
  //                   If you didn’t create an account, you can safely ignore this email.
  //                 </p>
  //                 <p style="margin-bottom:0;">
  //                   — Prisma Blog Team
  //                 </p>
  //               </td>
  //             </tr>
  //             <!-- Footer -->
  //             <tr>
  //               <td style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#666;">
  //                 © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
  //               </td>
  //             </tr>
  //           </table>
  //         </td>
  //       </tr>
  //     </table>
  //   </body>
  // </html>
  // `,
  //         });
  //         console.log("Message sent:", info.messageId);
  //       } catch (err) {
  //         console.error(err);
  //         throw err;
  //       }
  //     },
  //   },
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent"
    }
  }
});

// src/modules/category/category.router.ts
import { Router } from "express";

// src/modules/category/category.service.ts
import slugify from "slugify";
var createCategory = async (payload) => {
  const slug = slugify(payload.name, {
    lower: true,
    strict: true,
    trim: true
  });
  const result = await prisma.category.create({
    data: {
      name: payload.name,
      slug
    }
  });
  return result;
};
var getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  return categories;
};
var deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  const result = await prisma.category.delete({
    where: { id }
  });
  return result;
};
var categoryService = {
  createCategory,
  getAllCategories,
  deleteCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res, next) => {
  try {
    const result = await categoryService.createCategory(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
var getAllCategories2 = async (req, res, next) => {
  try {
    const result = await categoryService.getAllCategories();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var deleteCategory2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  deleteCategory: deleteCategory2
};

// src/middleware/auth.ts
var auth2 = (...roles) => {
  return async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorize!"
      });
    }
    req.user = session.user;
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorize to access this resource!"
      });
    }
    next();
  };
};

// src/modules/category/category.router.ts
var router = Router();
router.post("/", auth2(UserRole.ADMIN), categoryController.createCategory);
router.get("/", auth2(UserRole.ADMIN, UserRole.PROVIDER, UserRole.USER), categoryController.getAllCategories);
router.delete("/:id", auth2(UserRole.ADMIN), categoryController.deleteCategory);
var categoryRouter = router;

// src/modules/meals/meal.router.ts
import { Router as Router2 } from "express";

// src/modules/meals/meal.service.ts
var createMeal = async (data, userId) => {
  const result = await prisma.meal.create({
    data: {
      ...data,
      authorId: userId
    }
  });
  return result;
};
var getAllMeal = async ({
  cuisine,
  dietaryPreferences,
  minPrice,
  maxPrice
}) => {
  const addContition = [];
  if (cuisine) {
    addContition.push({ cuisine });
  }
  if (dietaryPreferences && dietaryPreferences.length > 0) {
    addContition.push({ dietaryPreferences: { hasSome: dietaryPreferences } });
  }
  if (minPrice !== void 0 && maxPrice !== void 0) {
    addContition.push({ price: { gte: minPrice, lte: maxPrice } });
  }
  const result = await prisma.meal.findMany({
    where: {
      AND: addContition
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var getMealById = async (id) => {
  const result = await prisma.meal.findUnique({
    where: { id }
  });
  return result;
};
var getMyMeal = async (authorId) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: UserStatus.ACTIVE
    },
    select: {
      id: true
    }
  });
  const result = await prisma.meal.findMany({
    where: {
      authorId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var updateMeal = async (mealId, data, authorId, isProvider) => {
  const existingMeal = await prisma.meal.findUniqueOrThrow({
    where: { id: mealId },
    select: { id: true, authorId: true }
  });
  if (isProvider && existingMeal.authorId !== authorId) {
    throw new Error("You are not authorized to update this meal");
  }
  const result = await prisma.meal.update({
    where: { id: mealId },
    data
  });
  return result;
};
var deleteMeal = async (mealId, authorId, isProvider) => {
  const existingMeal = await prisma.meal.findUniqueOrThrow({
    where: { id: mealId },
    select: { id: true, authorId: true }
  });
  if (isProvider && existingMeal.authorId !== authorId) {
    throw new Error("You are not authorized to delete this meal");
  }
  const result = await prisma.meal.delete({
    where: { id: mealId }
  });
  return result;
};
var mealService = {
  createMeal,
  getAllMeal,
  getMealById,
  getMyMeal,
  updateMeal,
  deleteMeal
};

// src/modules/meals/meal.controller.ts
var createMeal2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorize!"
      });
    }
    const result = await mealService.createMeal(req.body, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
var getAllMeal2 = async (req, res, next) => {
  try {
    const { cuisine, dietaryPreferences, minPrice, maxPrice } = req.query;
    const cuisineType = cuisine;
    const parsedDietaryPreferences = dietaryPreferences ? dietaryPreferences.split(",") : [];
    const minPriceNumber = minPrice ? Number(minPrice) : void 0;
    const maxPriceNumber = maxPrice ? Number(maxPrice) : void 0;
    const result = await mealService.getAllMeal({
      cuisine: cuisineType,
      dietaryPreferences: parsedDietaryPreferences,
      minPrice: minPriceNumber,
      maxPrice: maxPriceNumber
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var getMealById2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await mealService.getMealById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var getMyMeal2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "Unauthorize!"
      });
    }
    const result = await mealService.getMyMeal(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var updateMeal2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "You are Unauthorize!"
      });
    }
    const { id } = req.params;
    const isProvider = UserRole.PROVIDER === req.user.role;
    const result = await mealService.updateMeal(
      id,
      req.body,
      req.user.id,
      isProvider
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var deleteMeal2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        error: "You are Unauthorize!"
      });
    }
    const { id } = req.params;
    const isProvider = UserRole.PROVIDER === req.user.role;
    const result = await mealService.deleteMeal(
      id,
      req.user.id,
      isProvider
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var mealController = {
  createMeal: createMeal2,
  getAllMeal: getAllMeal2,
  getMealById: getMealById2,
  getMyMeal: getMyMeal2,
  updateMeal: updateMeal2,
  deleteMeal: deleteMeal2
};

// src/modules/meals/meal.router.ts
var router2 = Router2();
router2.get("/", mealController.getAllMeal);
router2.get("/:id", mealController.getMealById);
router2.get(
  "/provider/my-posts",
  auth2(UserRole.PROVIDER),
  mealController.getMyMeal
);
router2.post("/", auth2(UserRole.PROVIDER), mealController.createMeal);
router2.patch("/:id", auth2(UserRole.PROVIDER), mealController.updateMeal);
router2.delete("/:id", auth2(UserRole.PROVIDER), mealController.deleteMeal);
var mealRouter = router2;

// src/modules/orders/order.router.ts
import { Router as Router3 } from "express";

// src/modules/orders/order.service.ts
var createOrder = async ({
  authorId,
  deliveryAddress,
  paymentMethod,
  items
}) => {
  const mealIds = items.map((item) => item.mealId);
  const meals = await prisma.meal.findMany({
    where: {
      id: { in: mealIds },
      isAvailable: true
    }
  });
  let totalPrice = 0;
  let providerId = "";
  const orderItemsData = items.map((item) => {
    const meal = meals.find((m) => m.id === item.mealId);
    if (!meal) {
      throw new Error(`Meal ID ${item.mealId} is not available`);
    }
    providerId = meal.authorId;
    const itemTotal = meal.price * item.quantity;
    totalPrice += itemTotal;
    return {
      mealId: item.mealId,
      quantity: item.quantity,
      price: meal.price
    };
  });
  const order = await prisma.order.create({
    data: {
      authorId,
      providerId,
      deliveryAddress,
      ...paymentMethod && { paymentMethod },
      totalPrice,
      status: OrderStatus.PENDING,
      items: {
        create: orderItemsData
      }
    },
    include: {
      items: {
        include: {
          meal: {
            select: {
              authorId: true,
              title: true,
              imageUrl: true,
              cuisine: true
            }
          }
        }
      }
    }
  });
  return order;
};
var getAllOrders = async () => {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          meal: {
            select: {
              authorId: true,
              title: true,
              imageUrl: true,
              cuisine: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return orders;
};
var getUserOrders = async (authorId, providerId) => {
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        ...authorId ? [{ authorId }] : [],
        ...providerId ? [{ providerId }] : []
      ]
    },
    include: {
      items: {
        include: {
          meal: {
            select: {
              title: true,
              imageUrl: true,
              cuisine: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return orders;
};
var getOrderById = async (orderId, authorId) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      authorId
    },
    include: {
      items: {
        include: {
          meal: {
            select: {
              authorId: true,
              title: true,
              imageUrl: true,
              cuisine: true
            }
          }
        }
      }
    }
  });
  return order;
};
var updateOrderStatus = async (orderId, status) => {
  await prisma.order.findUniqueOrThrow({
    where: { id: orderId }
  });
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
  return order;
};
var OrderService = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
};

// src/modules/orders/order.controller.ts
var createOrder2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login for order" });
    }
    const { deliveryAddress, paymentMethod, items } = req.body;
    const result = await OrderService.createOrder({
      authorId: req.user.id,
      deliveryAddress,
      paymentMethod: paymentMethod || PaymentMethod.COD,
      items
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
var getAllOrders2 = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error
    });
  }
};
var getUserOrders2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login for get your orders" });
    }
    const result = await OrderService.getUserOrders(req.user.id, req.user.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var getOrderById2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const { id } = req.params;
    const result = await OrderService.getOrderById(id, req.user.id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var updateOrderStatus2 = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }
    const { id } = req.params;
    const { status } = req.body;
    const result = await OrderService.updateOrderStatus(id, status);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
var orderController = {
  createOrder: createOrder2,
  getUserOrders: getUserOrders2,
  getOrderById: getOrderById2,
  updateOrderStatus: updateOrderStatus2,
  getAllOrders: getAllOrders2
};

// src/modules/orders/order.router.ts
var router3 = Router3();
router3.post("/", auth2(UserRole.USER), orderController.createOrder);
router3.get(
  "/",
  auth2(UserRole.ADMIN, UserRole.PROVIDER, UserRole.USER),
  orderController.getAllOrders
);
router3.get(
  "/myorder",
  auth2(UserRole.ADMIN, UserRole.PROVIDER, UserRole.USER),
  orderController.getUserOrders
);
router3.get(
  "/:id",
  auth2(UserRole.USER, UserRole.PROVIDER, UserRole.ADMIN),
  orderController.getOrderById
);
router3.patch(
  "/:id",
  auth2(UserRole.PROVIDER),
  orderController.updateOrderStatus
);
var orderRouter = router3;

// src/modules/provider/provider.router.ts
import { Router as Router4 } from "express";

// src/modules/provider/provider.service.ts
var createProviderProfile = async (data) => {
  const newProvider = await prisma.providerProfile.create({ data });
  return newProvider;
};
var getProvierById = async (id) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id }
  });
  return provider;
};
var providerService = {
  createProviderProfile,
  getProvierById
};

// src/modules/provider/provider.controller.ts
var createProviderProfile2 = async (req, res, next) => {
  try {
    const result = await providerService.createProviderProfile(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
var getProviderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await providerService.getProvierById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var providerController = {
  createProviderProfile: createProviderProfile2,
  getProviderById
};

// src/modules/provider/provider.router.ts
var router4 = Router4();
router4.post("/", providerController.createProviderProfile);
router4.get("/:id", providerController.getProviderById);
var providerRouter = router4;

// src/modules/reivews/review.router.ts
import { Router as Router5 } from "express";

// src/modules/reivews/review.service.ts
var createReview = async ({
  rating,
  comment,
  mealId,
  authorId
}) => {
  const review = await prisma.review.create({
    data: {
      rating,
      comment: comment || null,
      mealId,
      authorId
    },
    include: {
      meal: {
        select: {
          title: true
        }
      }
    }
  });
  return review;
};
var getReviewsByMeal = async (mealId) => {
  const reviews = await prisma.review.findMany({
    where: { mealId },
    orderBy: {
      createdAt: "desc"
    }
  });
  return reviews;
};
var reviewService = {
  createReview,
  getReviewsByMeal
};

// src/modules/reivews/review.controller.ts
var createReview2 = async (req, res, next) => {
  try {
    const { rating, comment, mealId } = req.body;
    const userId = req.user.id;
    const result = await reviewService.createReview({
      rating,
      comment,
      mealId,
      authorId: userId
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};
var getReviewsByMeal2 = async (req, res, next) => {
  try {
    const { mealId } = req.params;
    const result = await reviewService.getReviewsByMeal(mealId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var ReviewController = {
  createReview: createReview2,
  getReviewsByMeal: getReviewsByMeal2
};

// src/modules/reivews/review.router.ts
var router5 = Router5();
router5.post("/", auth2(UserRole.USER), ReviewController.createReview);
router5.get("/:id", auth2(UserRole.USER), ReviewController.getReviewsByMeal);
var ReviewRouter = router5;

// src/modules/users/user.router.ts
import { Router as Router6 } from "express";

// src/modules/users/user.service.ts
var getUser = async () => {
  const result = await prisma.user.findMany();
  return result;
};
var getUserById = async (userId) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      phone: true,
      image: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return result;
};
var updateUser = async (userId, data) => {
  await prisma.user.findUnique({
    where: { id: userId }
  });
  const updateData = {
    ...data.status !== void 0 && { status: data.status },
    ...data.role !== void 0 && { role: data.role },
    ...data.phone !== void 0 && { phone: data.phone },
    ...data.image !== void 0 && { image: data.image },
    ...data.name !== void 0 && { name: data.name }
  };
  const result = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      phone: true,
      image: true,
      updatedAt: true
    }
  });
  return result;
};
var UserService = {
  getUser,
  getUserById,
  updateUser
};

// src/modules/users/user.controller.ts
var getUser2 = async (req, res, next) => {
  try {
    const result = await UserService.getUser();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var getUserById2 = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await UserService.getUserById(id);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var updateUser2 = async (req, res, next) => {
  try {
    const isUser = req?.user;
    if (!isUser) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { id } = req.params;
    const { status, role, phone, image, name } = req.body;
    const result = await UserService.updateUser(id, {
      status,
      role,
      phone,
      image,
      name
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
var userController = {
  getUser: getUser2,
  getUserById: getUserById2,
  updateUser: updateUser2
};

// src/modules/users/user.router.ts
var router6 = Router6();
router6.get("/", auth2(UserRole.ADMIN), userController.getUser);
router6.get(
  "/:id",
  auth2(UserRole.ADMIN, UserRole.PROVIDER, UserRole.USER),
  userController.getUserById
);
router6.patch(
  "/:id",
  auth2(UserRole.ADMIN, UserRole.PROVIDER, UserRole.USER),
  userController.updateUser
);
var userRouter = router6;

// src/app.ts
var app = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true
  })
);
app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/meals", mealRouter);
app.use("/api/providers", providerRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", ReviewRouter);
app.use("/api/categories", categoryRouter);
app.get("/", (req, res) => {
  res.send("Food Hub API is running");
});
var app_default = app;
export {
  app_default as default
};
