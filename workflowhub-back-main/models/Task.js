import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["todo", "in-progress", "done"],
        message: "Status must be todo, in-progress, or done",
      },
      default: "todo",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium, or high",
      },
      default: "medium",
    },
    assignee: {
      name: {
        type: String,
        required: [true, "Assignee name is required"],
        trim: true,
      },
      avatar: {
        type: String,
        trim: true,
      },
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project ID is required"],
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value > new Date();
        },
        message: "Due date must be in the future",
      },
    },
    estimatedHours: {
      type: Number,
      min: [0, "Estimated hours cannot be negative"],
    },
    actualHours: {
      type: Number,
      min: [0, "Actual hours cannot be negative"],
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for days remaining
TaskSchema.virtual("daysRemaining").get(function () {
  if (!this.dueDate) return null;
  const now = new Date();
  const diffTime = this.dueDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for completion percentage
TaskSchema.virtual("completionPercentage").get(function () {
  if (this.status === "done") return 100;
  if (this.status === "in-progress") return 50;
  return 0;
});

// Method to get project details
TaskSchema.methods.getProject = async function () {
  const Project = mongoose.model("Project");
  return await Project.findById(this.projectId);
};

// Method to update project progress when task status changes
TaskSchema.methods.updateProjectProgress = async function () {
  const Project = mongoose.model("Project");
  const project = await Project.findById(this.projectId);

  if (project) {
    await project.calculateProgressFromTasks();
    await project.save();
  }
};

// Pre-save middleware to update project progress when task status changes
TaskSchema.pre("save", async function (next) {
  // Only update project progress if status changed
  if (this.isModified("status")) {
    try {
      await this.updateProjectProgress();
    } catch (error) {
      console.error("Error updating project progress:", error);
    }
  }
  next();
});

// Pre-remove middleware to update project progress when task is deleted
TaskSchema.pre("remove", async function (next) {
  try {
    await this.updateProjectProgress();
  } catch (error) {
    console.error("Error updating project progress after task removal:", error);
  }
  next();
});

// Indexes for better query performance
TaskSchema.index({ status: 1, priority: 1, projectId: 1 });
TaskSchema.index({ assignee: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ createdAt: -1 });

export default mongoose.model("Task", TaskSchema);
