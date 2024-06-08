import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { hash } from "argon2";
import { sendCreateTechnicianAccount } from "../utils/templateEmailHtml";

export const userRouter = createTRPCRouter({
  getUserByDepartmentId: protectedProcedure
    .input(z.object({ departmentId: z.number() }))
    .query(async ({ input, ctx }) => {
      const users = await ctx.prisma.user.findMany({
        where: {
          departmentId: input.departmentId,
        },
      });

      return users;
    }),

  createTechnician: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).trim(),
        email: z.string().email(),
        password: z.string().min(8),
        phoneNumber: z.string().optional().nullable(),
        departmentId: z.number(),
        isPIC: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = input.name.trim().toLowerCase().split(" ").join("-");

      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          departmentId: input.departmentId,
          password: await hash(input.password),
          username,
          phoneNumber: input.phoneNumber?.trim().replace("+", ""),
          role: "TECHNICIAN",
        },
      });

      if (!user) throw new Error("Cannot create user");

      await sendCreateTechnicianAccount(
        input.email,
        input.name,
        input.password
      );

      if (input.isPIC) {
        await ctx.prisma.department.update({
          where: {
            id: input.departmentId,
          },
          data: {
            emailPic: user.email,
          },
        });
      }

      return user;
    }),

  updateTechnician: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(3).trim(),
        email: z.string().email(),
        phoneNumber: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const username = input.name.trim().toLowerCase().split(" ").join("-");

      const user = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          username,
          phoneNumber: input.phoneNumber?.trim().replace("+", ""),
        },
      });

      return user;
    }),
});
