import express from "express";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByProject,
  updateTaskStatus,
  getTaskStats,
} from "../controllers/taskController.js";
import {
  validateRequest,
  taskValidationSchema,
  taskUpdateValidationSchema,
} from "../middleware/validation.js";

const router = express.Router();

// Get all tasks with optional filtering
router.get("/", getTasks);

// Get task statistics
router.get("/stats", getTaskStats);

// Get tasks by project
router.get("/project/:projectId", getTasksByProject);

// Get one task
router.get("/:id", getTask);

// Create new task
router.post("/", validateRequest(taskValidationSchema), createTask);

// Update task
router.put("/:id", validateRequest(taskUpdateValidationSchema), updateTask);

// Update task status only
router.patch("/:id/status", updateTaskStatus);

// Delete task
router.delete("/:id", deleteTask);

export default router;
