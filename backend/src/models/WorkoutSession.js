import mongoose from "mongoose";

const setSchema = new mongoose.Schema({
  setNumber: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    default: "",
  },
});

const exerciseLogSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  sets: [setSchema],
  totalVolume: {
    type: Number,
    default: 0,
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

const workoutSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workout",
      default: null,
    },
    workoutName: {
      type: String,
      required: true,
    },
    exercises: [exerciseLogSchema],
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed", "cancelled"],
      default: "in-progress",
    },
    totalVolume: {
      type: Number,
      default: 0,
    },
    totalSets: {
      type: Number,
      default: 0,
    },
    totalReps: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
    personalRecords: [
      {
        exerciseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Exercise",
        },
        exerciseName: String,
        type: {
          type: String,
          enum: ["weight", "reps", "volume"],
        },
        previousValue: Number,
        newValue: Number,
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
workoutSessionSchema.index({ userId: 1, createdAt: -1 });
workoutSessionSchema.index({ workoutId: 1 });
workoutSessionSchema.index({ status: 1 });
workoutSessionSchema.index({ startTime: -1 });

// Calculate totals before saving
workoutSessionSchema.pre("save", function (next) {
  if (this.isModified("exercises")) {
    let totalVolume = 0;
    let totalSets = 0;
    let totalReps = 0;

    this.exercises.forEach((exercise) => {
      let exerciseVolume = 0;
      exercise.sets.forEach((set) => {
        if (set.completed) {
          exerciseVolume += set.reps * set.weight;
          totalSets += 1;
          totalReps += set.reps;
        }
      });
      exercise.totalVolume = exerciseVolume;
      totalVolume += exerciseVolume;
    });

    this.totalVolume = totalVolume;
    this.totalSets = totalSets;
    this.totalReps = totalReps;
  }

  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }

  next();
});

const WorkoutSession = mongoose.model("WorkoutSession", workoutSessionSchema);

export default WorkoutSession;
