import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    bodyWeight: {
      type: Number,
      min: [0, "Body weight cannot be negative"],
      default: null,
    },
    bodyFat: {
      type: Number,
      min: [0, "Body fat percentage cannot be negative"],
      max: [100, "Body fat percentage cannot exceed 100"],
      default: null,
    },
    muscleMass: {
      type: Number,
      min: [0, "Muscle mass cannot be negative"],
      default: null,
    },
    measurements: {
      chest: { type: Number, default: null },
      waist: { type: Number, default: null },
      hips: { type: Number, default: null },
      biceps: { type: Number, default: null },
      thighs: { type: Number, default: null },
      calves: { type: Number, default: null },
    },
    exerciseRecords: [
      {
        exerciseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Exercise",
        },
        exerciseName: String,
        maxWeight: {
          type: Number,
          default: 0,
        },
        maxReps: {
          type: Number,
          default: 0,
        },
        maxVolume: {
          type: Number,
          default: 0,
        },
        oneRepMax: {
          type: Number,
          default: 0,
        },
      },
    ],
    workoutStats: {
      totalWorkouts: {
        type: Number,
        default: 0,
      },
      totalVolume: {
        type: Number,
        default: 0,
      },
      averageDuration: {
        type: Number,
        default: 0,
      },
    },
    notes: {
      type: String,
      default: "",
      maxlength: [500, "Notes cannot be more than 500 characters"],
    },
    photos: [
      {
        url: String,
        description: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
progressSchema.index({ userId: 1, date: -1 });
progressSchema.index({ date: -1 });

// Ensure only one progress entry per user per day
progressSchema.index({ userId: 1, date: 1 }, { unique: true });

const Progress = mongoose.model("Progress", progressSchema);

export default Progress;
