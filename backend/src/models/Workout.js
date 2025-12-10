import mongoose from "mongoose";

const exerciseItemSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
    min: [1, "Sets must be at least 1"],
  },
  reps: {
    type: Number,
    required: true,
    min: [1, "Reps must be at least 1"],
  },
  weight: {
    type: Number,
    default: 0,
    min: [0, "Weight cannot be negative"],
  },
  restTime: {
    type: Number,
    default: 60, // seconds
    min: [0, "Rest time cannot be negative"],
  },
  notes: {
    type: String,
    default: "",
  },
  order: {
    type: Number,
    required: true,
  },
});

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Workout name is required"],
      trim: true,
      maxlength: [100, "Workout name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    exercises: [exerciseItemSchema],
    category: {
      type: String,
      enum: ["Strength", "Cardio", "Flexibility", "Sports", "Custom"],
      default: "Custom",
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    estimatedDuration: {
      type: Number, // in minutes
      default: 60,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isTemplate: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    timesCompleted: {
      type: Number,
      default: 0,
    },
    lastPerformed: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
workoutSchema.index({ userId: 1, createdAt: -1 });
workoutSchema.index({ name: "text", description: "text" });
workoutSchema.index({ category: 1 });

// Virtual for total exercises
workoutSchema.virtual("totalExercises").get(function () {
  return this.exercises.length;
});

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
