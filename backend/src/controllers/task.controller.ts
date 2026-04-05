import { Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../server";
import { AuthRequest } from "../middlewares/auth.middleware";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const getTasks = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { page = "1", limit = "10", status, search } = req.query;

  const take = parseInt(limit as string, 10);
  const skip = (parseInt(page as string, 10) - 1) * take;

  const where: any = { userId };

  if (status && status !== 'ALL') {
    where.status = status as string;
  }

  if (search) {
    where.title = {
      contains: search as string,
      mode: "insensitive", // requires PostgreSQL
    };
  }

  const [tasks, total] = await Promise.all([
    (prisma.task as any).findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    (prisma.task as any).count({ where }),
  ]);

  res.status(200).json({
    tasks,
    pagination: {
      total,
      page: parseInt(page as string, 10),
      limit: take,
      totalPages: Math.ceil(total / take),
    },
  });
});

export const createTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { title, description } = taskSchema.parse(req.body);

  const task = await (prisma.task as any).create({
    data: { 
      title, 
      description: description ?? null, 
      userId 
    },
  });

  res.status(201).json(task);
});

export const getTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;

  const task = await (prisma.task as any).findFirst({
    where: { id, userId },
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
});

export const updateTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { title, description, status } = req.body;

  const existingTask = await (prisma.task as any).findFirst({
    where: { id, userId },
  });

  if (!existingTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  const task = await (prisma.task as any).update({
    where: { id: existingTask.id },
    data: { 
      title: title ?? undefined, 
      description: description ?? undefined, 
      status: status ?? undefined 
    },
  });

  res.status(200).json(task);
});

export const deleteTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;

  const existingTask = await (prisma.task as any).findFirst({
    where: { id, userId },
  });

  if (!existingTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  await (prisma.task as any).delete({
    where: { id: (existingTask as any).id },
  });

  res.status(200).json({ message: "Task deleted successfully" });
});

export const toggleTaskStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;

  const existingTask = await (prisma.task as any).findFirst({
    where: { id, userId },
  });

  if (!existingTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  const newStatus = existingTask.status === "PENDING" ? "COMPLETED" : "PENDING";

  const task = await (prisma.task as any).update({
    where: { id: existingTask.id },
    data: { status: newStatus },
  });

  res.status(200).json(task);
});
