import Task from "../models/Task.js";
import Project from "../models/Project.js";
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from "../utils/responseHandler.js";

// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const { status, priority, assignee, projectId } = req.query;
    const options = {};

    if (status) options.status = status;
    if (priority) options.priority = priority;
    if (assignee) options["assignee.name"] = assignee;
    if (projectId) options.projectId = projectId;

    const tasks = await Task.find(options)
      .populate("projectId", "title status")
      .sort({ createdAt: -1 });

    return successResponse(res, tasks, "Tasks retrieved successfully");
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return errorResponse(res, "Failed to fetch tasks", 500);
  }
};

// Get one task
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "projectId",
      "title status progress"
    );

    if (!task) {
      return notFoundResponse(res, "Task");
    }

    return successResponse(res, task, "Task retrieved successfully");
  } catch (error) {
    console.error("Error fetching task:", error);
    return errorResponse(res, "Failed to fetch task", 500);
  }
};

// Create task
export const createTask = async (req, res) => {
  try {
    // Verify project exists
    const project = await Project.findById(req.body.projectId);
    if (!project) {
      return errorResponse(res, "Project not found", 404);
    }

    const newTask = new Task(req.body);
    const savedTask = await newTask.save();

    // Populate project details
    await savedTask.populate("projectId", "title status");

    return successResponse(res, savedTask, "Task created successfully", 201);
  } catch (error) {
    console.error("Error creating task:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return errorResponse(res, "Validation failed", 400, errors);
    }

    return errorResponse(res, "Failed to create task", 500);
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("projectId", "title status");

    if (!updatedTask) {
      return notFoundResponse(res, "Task");
    }

    return successResponse(res, updatedTask, "Task updated successfully");
  } catch (error) {
    console.error("Error updating task:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return errorResponse(res, "Validation failed", 400, errors);
    }

    return errorResponse(res, "Failed to update task", 500);
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return notFoundResponse(res, "Task");
    }

    return successResponse(res, null, "Task deleted successfully");
  } catch (error) {
    console.error("Error deleting task:", error);
    return errorResponse(res, "Failed to delete task", 500);
  }
};

// Get tasks by project
export const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assignee } = req.query;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return notFoundResponse(res, "Project");
    }

    const options = { projectId };
    if (status) options.status = status;
    if (priority) options.priority = priority;
    if (assignee) options["assignee.name"] = assignee;

    const tasks = await Task.find(options)
      .populate("projectId", "title status")
      .sort({ createdAt: -1 });

    return successResponse(res, tasks, "Project tasks retrieved successfully");
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    return errorResponse(res, "Failed to fetch project tasks", 500);
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["todo", "in-progress", "done"];

    if (!validStatuses.includes(status)) {
      return errorResponse(
        res,
        "Invalid status. Must be todo, in-progress, or done",
        400
      );
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    ).populate("projectId", "title status");

    if (!updatedTask) {
      return notFoundResponse(res, "Task");
    }

    return successResponse(
      res,
      updatedTask,
      "Task status updated successfully"
    );
  } catch (error) {
    console.error("Error updating task status:", error);
    return errorResponse(res, "Failed to update task status", 500);
  }
};

// Get task statistics
export const getTaskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          todoTasks: {
            $sum: { $cond: [{ $eq: ["$status", "todo"] }, 1, 0] },
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
          completedTasks: {
            $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] },
          },
          highPriorityTasks: {
            $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] },
          },
        },
      },
    ]);

    const taskStats = stats[0] || {
      totalTasks: 0,
      todoTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
      highPriorityTasks: 0,
    };

    return successResponse(
      res,
      taskStats,
      "Task statistics retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching task statistics:", error);
    return errorResponse(res, "Failed to fetch task statistics", 500);
  }
};
