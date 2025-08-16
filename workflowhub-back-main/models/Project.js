import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
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
        values: ["planning", "active", "completed", "on-hold"],
        message: "Status must be planning, active, completed, or on-hold",
      },
      default: "planning",
    },
    progress: {
      type: Number,
      min: [0, "Progress cannot be less than 0"],
      max: [100, "Progress cannot be more than 100"],
      default: 0,
    },
    team: [
      {
        name: {
          type: String,
          required: [true, "Team member name is required"],
          trim: true,
        },
        avatar: {
          type: String,
          trim: true,
        },
      },
    ],
    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value > new Date();
        },
        message: "Due date must be in the future",
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for days remaining
ProjectSchema.virtual("daysRemaining").get(function () {
  if (!this.dueDate) return null;
  const now = new Date();
  const diffTime = this.dueDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for tasks associated with this project
ProjectSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "projectId",
});

// Virtual for task count
ProjectSchema.virtual("taskCount", {
  ref: "Task",
  localField: "_id",
  foreignField: "projectId",
  count: true,
});

// Virtual for completed tasks count
ProjectSchema.virtual("completedTaskCount", {
  ref: "Task",
  localField: "_id",
  foreignField: "projectId",
  count: true,
  match: { status: "done" },
});

// Method to calculate project progress based on tasks
ProjectSchema.methods.calculateProgressFromTasks = async function () {
  const Task = mongoose.model("Task");
  const tasks = await Task.find({ projectId: this._id });

  if (tasks.length === 0) {
    this.progress = 0;
    return 0;
  }

  const completedTasks = tasks.filter((task) => task.status === "done").length;
  this.progress = Math.round((completedTasks / tasks.length) * 100);
  return this.progress;
};

// Method to get all tasks for this project
ProjectSchema.methods.getTasks = async function (options = {}) {
  const Task = mongoose.model("Task");
  const query = { projectId: this._id };

  // Apply filters if provided
  if (options.status) query.status = options.status;
  if (options.priority) query.priority = options.priority;
  if (options.assignee) query["assignee.name"] = options.assignee;

  return await Task.find(query).sort({ createdAt: -1 });
};

// Pre-save middleware to update progress if not manually set
ProjectSchema.pre("save", async function (next) {
  // Only calculate progress from tasks if progress wasn't manually set
  if (this.isModified("progress") && !this.isNew) {
    return next();
  }

  try {
    await this.calculateProgressFromTasks();
  } catch (error) {
    // If there's an error calculating progress, continue with save
    console.error("Error calculating progress from tasks:", error);
  }
  next();
});

// Index for better query performance
ProjectSchema.index({ status: 1, createdAt: -1 });
ProjectSchema.index({ dueDate: 1 });

export default mongoose.model("Project", ProjectSchema);
