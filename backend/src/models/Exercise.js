import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exercise name is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Exercise name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Strength", "Cardio", "Flexibility", "Core", "Sports", "Other"],
    },
    muscle: {
      type: String,
      required: [true, "Primary muscle group is required"],
      enum: [
        "Chest",
        "Back",
        "Shoulders",
        "Biceps",
        "Triceps",
        "Forearms",
        "Legs",
        "Quads",
        "Hamstrings",
        "Calves",
        "Glutes",
        "Core",
        "Abs",
        "Obliques",
        "Full Body",
        "Cardio",
      ],
    },
    secondaryMuscles: [
      {
        type: String,
        enum: [
          "Chest",
          "Back",
          "Shoulders",
          "Biceps",
          "Triceps",
          "Forearms",
          "Legs",
          "Quads",
          "Hamstrings",
          "Calves",
          "Glutes",
          "Core",
          "Abs",
          "Obliques",
          "Full Body",
        ],
      },
    ],
    equipment: {
      type: String,
      required: [true, "Equipment type is required"],
      enum: [
        "Barbell",
        "Dumbbell",
        "Kettlebell",
        "Machine",
        "Cable",
        "Bodyweight",
        "Resistance Band",
        "Medicine Ball",
        "Pull-up Bar",
        "Bench",
        "Other",
      ],
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty level is required"],
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Intermediate",
    },
    instructions: [
      {
        type: String,
        required: true,
      },
    ],
    tips: [
      {
        type: String,
      },
    ],
    videoUrl: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
exerciseSchema.index({ name: "text", description: "text" });
exerciseSchema.index({ category: 1, muscle: 1 });
exerciseSchema.index({ difficulty: 1 });
exerciseSchema.index({ equipment: 1 });

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
