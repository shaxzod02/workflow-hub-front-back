import Project from "../models/Project.js";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "../utils/responseHandler.js";

// Get all projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return successResponse(res, projects, "Projects retrieved successfully");
  } catch (error) {
    console.error("Error fetching projects:", error);
    return errorResponse(res, "Failed to fetch projects", 500);
  }
};

// Get one project
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("tasks")
      .populate("taskCount")
      .populate("completedTaskCount");

    if (!project) {
      return notFoundResponse(res, "Project");
    }

    return successResponse(res, project, "Project retrieved successfully");
  } catch (error) {
    console.error("Error fetching project:", error);
    return errorResponse(res, "Failed to fetch project", 500);
  }
};

// Create project
export const createProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    const savedProject = await newProject.save();

    return successResponse(
      res,
      savedProject,
      "Project created successfully",
      201
    );
  } catch (error) {
    console.error("Error creating project:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return errorResponse(res, "Validation failed", 400, errors);
    }

    return errorResponse(res, "Failed to create project", 500);
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProject) {
      return notFoundResponse(res, "Project");
    }

    return successResponse(res, updatedProject, "Project updated successfully");
  } catch (error) {
    console.error("Error updating project:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return errorResponse(res, "Validation failed", 400, errors);
    }

    return errorResponse(res, "Failed to update project", 500);
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      return notFoundResponse(res, "Project");
    }

    return successResponse(res, null, "Project deleted successfully");
  } catch (error) {
    console.error("Error deleting project:", error);
    return errorResponse(res, "Failed to delete project", 500);
  }
};

// Get project tasks
export const getProjectTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return notFoundResponse(res, "Project");
    }

    const { status, priority, assignee } = req.query;
    const options = {};

    if (status) options.status = status;
    if (priority) options.priority = priority;
    if (assignee) options.assignee = assignee;

    const tasks = await project.getTasks(options);

    return successResponse(res, tasks, "Project tasks retrieved successfully");
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    return errorResponse(res, "Failed to fetch project tasks", 500);
  }
};

// Get project statistics
export const getProjectStats = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("taskCount")
      .populate("completedTaskCount");

    if (!project) {
      return notFoundResponse(res, "Project");
    }

    // Calculate additional statistics
    const stats = {
      totalTasks: project.taskCount || 0,
      completedTasks: project.completedTaskCount || 0,
      pendingTasks:
        (project.taskCount || 0) - (project.completedTaskCount || 0),
      progress: project.progress,
      daysRemaining: project.daysRemaining,
      status: project.status,
      teamSize: project.team.length,
    };

    return successResponse(
      res,
      stats,
      "Project statistics retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching project statistics:", error);
    return errorResponse(res, "Failed to fetch project statistics", 500);
  }
};

// Update project progress from tasks
export const updateProjectProgress = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return notFoundResponse(res, "Project");
    }

    const newProgress = await project.calculateProgressFromTasks();
    await project.save();

    return successResponse(
      res,
      { progress: newProgress },
      "Project progress updated successfully"
    );
  } catch (error) {
    console.error("Error updating project progress:", error);
    return errorResponse(res, "Failed to update project progress", 500);
  }
};
