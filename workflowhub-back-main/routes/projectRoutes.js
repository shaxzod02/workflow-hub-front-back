import express from "express";
const router = express.Router();
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectTasks,
  getProjectStats,
  updateProjectProgress,
} from "../controllers/projectController.js";
import {
  validateRequest,
  projectValidationSchema,
  projectUpdateValidationSchema,
} from "../middleware/validation.js";

// GET /api/projects - Get all projects
router.get("/", getProjects);

// GET /api/projects/:id - Get single project
router.get("/:id", getProject);

// GET /api/projects/:id/tasks - Get project tasks
router.get("/:id/tasks", getProjectTasks);

// GET /api/projects/:id/stats - Get project statistics
router.get("/:id/stats", getProjectStats);

// POST /api/projects - Create new project
router.post("/", validateRequest(projectValidationSchema), createProject);

// PUT /api/projects/:id - Update project
router.put(
  "/:id",
  validateRequest(projectUpdateValidationSchema),
  updateProject
);

// PUT /api/projects/:id/progress - Update project progress from tasks
router.put("/:id/progress", updateProjectProgress);

// DELETE /api/projects/:id - Delete project
router.delete("/:id", deleteProject);

export default router;
