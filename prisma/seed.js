import { PrismaClient } from "@prisma/client";
import { hash } from "argon2";

const prisma = new PrismaClient();
async function main() {
  const akunfajri = await prisma.user.upsert({
    where: {
      email: "zahidfajrir@gmail.com",
    },
    update: {},
    create: {
      email: "zahidfajrir@gmail.com",
      username: "admin",
      name: "Admin",
      password: await hash("admin"),
      role: "ADMIN",
    },
  });
  if (akunfajri) console.log(`${akunfajri.name} created`);

  const departmentSeeds = [
    {
      title: "Operations Department",
      description:
        "Manages the day-to-day operations, including loading and unloading of cargo.",
    },
    {
      title: "Harbor Master's Office",
      description:
        "Oversees the movement of ships in and out of the port, ensuring safe and efficient navigation.",
    },
    {
      title: "Customs Department",
      description:
        "Handles the inspection and clearance of goods, ensuring compliance with customs regulations.",
    },
    {
      title: "Security Department",
      description:
        "Responsible for the security of the port, including monitoring and preventing unauthorized access.",
    },
    {
      title: "Maintenance Department",
      description:
        "Maintains and repairs port infrastructure, equipment, and facilities.",
    },
    {
      title: "Finance Department",
      description:
        "Manages the port's financial activities, including budgeting, accounting, and financial reporting.",
    },
    {
      title: "Environmental Department",
      description:
        "Ensures that port operations comply with environmental regulations and manages initiatives to reduce environmental impact.",
    },
    {
      title: "IT Department",
      description:
        "Provides technical support and manages the port's information systems and technology infrastructure.",
      emailPic: "frost.75.asafarhan@gmail.com",
    },
    {
      title: "Human Resources Department",
      description:
        "Manages employee relations, recruitment, training, and benefits.",
    },
    {
      title: "Commercial Department",
      description:
        "Focuses on business development, marketing, and customer relations to attract and retain port users.",
    },
  ];
  let departmentId = null;
  for (const department of departmentSeeds) {
    const createdObject = await prisma.department.upsert({
      where: {
        name: department.title,
      },
      update: {},
      create: {
        name: department.title,
        description: department.description,
        emailPic: department.emailPic,
      },
    });
    if (createdObject) console.log(`${createdObject.name} created`);
    if (createdObject.name === "IT Department") departmentId = createdObject.id;
  }

  const technicianPIC = await prisma.user.upsert({
    where: {
      email: "frost.75.asafarhan@gmail.com",
    },
    update: {},
    create: {
      email: "frost.75.asafarhan@gmail.com",
      username: "asa-it",
      name: "Asa IT",
      password: await hash("abcde123"),
      role: "TECHNICIAN",
      departmentId,
    },
  });
  if (technicianPIC) console.log(`${technicianPIC.name} created`);

  const technician = await prisma.user.upsert({
    where: {
      email: "asamuhammadfarhan@student.uns.ac.id",
    },
    update: {},
    create: {
      email: "asamuhammadfarhan@student.uns.ac.id",
      username: "asa-it-coworker",
      name: "Asa IT Coworker",
      password: await hash("abcde123"),
      role: "TECHNICIAN",
      departmentId,
    },
  });
  if (technician) console.log(`${technician.name} created`);

}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
