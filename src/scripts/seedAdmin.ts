import { UserRole } from "../../generated/client/enums";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    const adminData = {
      name: "foodhub",
      email: "foodhub@gamil.com",
      password: "foodhub123",
      role: UserRole.ADMIN,
    };

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      throw new Error("user already exists!!");
    }

    const adminSignUp = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify(adminData),
      },
    );

    if (adminSignUp.ok) {
      await prisma.user.update({
        where: { email: adminData.email },
        data: { emailVerified: true },
      });
    }
    console.log("Admin created Successfully");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}
seedAdmin();
