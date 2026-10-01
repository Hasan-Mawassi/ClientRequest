import "dotenv/config";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  const passwordHash = await bcrypt.hash("Password123", 12);

  const user = await prisma.user.upsert({
    where: {
      email: "demo@example.com",
    },
    update: {
      name: "Demo User",
      passwordHash,
    },
    create: {
      name: "Demo User",
      email: "demo@example.com",
      passwordHash,
    },
  });

  // Remove existing demo requests so the seed is repeatable.
  await prisma.clientRequest.deleteMany({
    where: {
      createdById: user.id,
    },
  });

  const requests = [
    {
      clientName: "Acme Corporation",
      title: "Website redesign",
      description:
        "Update the company website with a modern responsive design.",
      status: "NEW" as const,
    },
    {
      clientName: "Tech Solutions",
      title: "API integration",
      description: "Integrate the existing system with the new payment API.",
      status: "NEW" as const,
    },
    {
      clientName: "Green Market",
      title: "Inventory dashboard",
      description: "Build a dashboard to monitor inventory and stock levels.",
      status: "NEW" as const,
    },

    {
      clientName: "Global Logistics",
      title: "Shipment tracking",
      description: "Implement shipment tracking with real-time status updates.",
      status: "IN_PROGRESS" as const,
    },
    {
      clientName: "Modern Health",
      title: "Patient portal",
      description: "Improve the patient portal and add appointment management.",
      status: "IN_PROGRESS" as const,
    },
    {
      clientName: "Bright Finance",
      title: "Reporting system",
      description: "Create monthly financial reports for administrators.",
      status: "IN_PROGRESS" as const,
    },

    {
      clientName: "Nova Retail",
      title: "E-commerce platform",
      description:
        "Develop the initial e-commerce platform and product catalog.",
      status: "DONE" as const,
    },
    {
      clientName: "City Services",
      title: "Customer management",
      description:
        "Implement customer management and support request tracking.",
      status: "DONE" as const,
    },
    {
      clientName: "Alpha Consulting",
      title: "Internal dashboard",
      description: "Create an internal dashboard for company operations.",
      status: "DONE" as const,
    },

    // Additional records for dashboard history
    {
      clientName: "Blue Ocean",
      title: "Mobile application",
      description: "Build a mobile application for customers.",
      status: "DONE" as const,
    },
    {
      clientName: "Smart Office",
      title: "Office management",
      description: "Digitize internal office management workflows.",
      status: "DONE" as const,
    },
    {
      clientName: "Future Systems",
      title: "Authentication system",
      description: "Implement secure authentication and authorization.",
      status: "DONE" as const,
    },
  ];

  await prisma.clientRequest.createMany({
    data: requests.map((request) => ({
      ...request,
      createdById: user.id,
    })),
  });

  console.log("✅ Seed completed successfully.");
  console.log("");
  console.log("Demo account:");
  console.log("Email:    demo@example.com");
  console.log("Password: Password123");
  console.log("");
  console.log(`Created ${requests.length} requests.`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
