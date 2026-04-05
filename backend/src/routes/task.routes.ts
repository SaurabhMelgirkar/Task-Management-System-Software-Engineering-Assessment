import { Router } from "express";
import { getTasks, createTask, getTask, updateTask, deleteTask, toggleTaskStatus } from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.route("/")
  .get(getTasks)
  .post(createTask);

router.route("/:id")
  .get(getTask)
  .patch(updateTask)
  .delete(deleteTask);

router.patch("/:id/toggle", toggleTaskStatus);

export default router;
