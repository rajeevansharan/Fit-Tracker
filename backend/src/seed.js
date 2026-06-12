import dotenv from "dotenv";
import prisma from "./lib/prisma.js";

dotenv.config();

const exercises = [
  {
    name: "Bench Press",
    description: "Classic chest exercise using a barbell",
    category: "Strength",
    muscle: "Chest",
    secondaryMuscles: ["Triceps", "Shoulders"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Lie flat on bench with feet firmly on ground",
      "Grip barbell with hands slightly wider than shoulder width",
      "Lower bar to chest with control",
      "Press bar up explosively to starting position",
    ],
    tips: [
      "Keep your shoulder blades retracted",
      "Maintain a slight arch in your lower back",
      "Keep feet flat on the ground throughout",
    ],
  },
  {
    name: "Squats",
    description: "Fundamental leg exercise for building lower body strength",
    category: "Strength",
    muscle: "Legs",
    secondaryMuscles: ["Glutes", "Core"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower body by bending knees and hips",
      "Keep chest up and knees tracking over toes",
      "Return to starting position by driving through heels",
    ],
    tips: [
      "Keep your core tight throughout the movement",
      "Avoid letting knees cave inward",
      "Go as deep as your mobility allows",
    ],
  },
  {
    name: "Pull-ups",
    description: "Bodyweight exercise for back and arm development",
    category: "Strength",
    muscle: "Back",
    secondaryMuscles: ["Biceps", "Shoulders"],
    equipment: "Pull-up Bar",
    difficulty: "Advanced",
    instructions: [
      "Hang from pull-up bar with palms facing away",
      "Pull body up until chin clears the bar",
      "Lower body with control to starting position",
      "Repeat for desired reps",
    ],
    tips: [
      "Engage your lats before pulling",
      "Avoid swinging or using momentum",
      "Full range of motion is key",
    ],
  },
  {
    name: "Push-ups",
    description: "Classic bodyweight chest and triceps exercise",
    category: "Strength",
    muscle: "Chest",
    secondaryMuscles: ["Triceps", "Shoulders", "Core"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Start in plank position with hands under shoulders",
      "Lower body until chest nearly touches ground",
      "Push back up to starting position",
      "Keep core tight throughout movement",
    ],
    tips: [
      "Maintain a straight line from head to heels",
      "Keep elbows at 45-degree angle",
      "Control the descent",
    ],
  },
  {
    name: "Deadlift",
    description: "Compound lift for overall strength development",
    category: "Strength",
    muscle: "Back",
    secondaryMuscles: ["Legs", "Glutes", "Core"],
    equipment: "Barbell",
    difficulty: "Advanced",
    instructions: [
      "Stand with feet hip-width apart, bar over mid-foot",
      "Bend at hips and knees to grip bar",
      "Keep chest up and back straight",
      "Drive through heels to lift bar, extending hips and knees",
    ],
    tips: [
      "Keep the bar close to your body",
      "Engage your lats throughout",
      "Avoid rounding your back",
    ],
  },
  {
    name: "Plank",
    description: "Isometric core strengthening exercise",
    category: "Core",
    muscle: "Core",
    secondaryMuscles: ["Shoulders", "Glutes"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Start in push-up position",
      "Lower to forearms, keeping body straight",
      "Hold position while breathing normally",
      "Keep core engaged throughout",
    ],
    tips: [
      "Don't let hips sag or pike up",
      "Squeeze glutes for stability",
      "Focus on breathing steadily",
    ],
  },
  {
    name: "Shoulder Press",
    description: "Overhead press for shoulder development",
    category: "Strength",
    muscle: "Shoulders",
    secondaryMuscles: ["Triceps", "Core"],
    equipment: "Dumbbell",
    difficulty: "Intermediate",
    instructions: [
      "Stand with dumbbells at shoulder height",
      "Press weights overhead until arms are extended",
      "Lower with control back to starting position",
      "Repeat for desired reps",
    ],
    tips: [
      "Keep core tight to avoid arching back",
      "Press in a slight arc, not straight up",
      "Control the weight on the way down",
    ],
  },
  {
    name: "Barbell Row",
    description: "Compound back exercise for thickness",
    category: "Strength",
    muscle: "Back",
    secondaryMuscles: ["Biceps", "Shoulders"],
    equipment: "Barbell",
    difficulty: "Intermediate",
    instructions: [
      "Bend at hips with slight knee bend, back straight",
      "Grip barbell with hands shoulder-width apart",
      "Pull bar to lower chest, squeezing shoulder blades",
      "Lower bar with control to starting position",
    ],
    tips: [
      "Keep your back flat throughout",
      "Pull with your elbows, not hands",
      "Avoid using momentum",
    ],
  },
  {
    name: "Lunges",
    description: "Unilateral leg exercise for balance and strength",
    category: "Strength",
    muscle: "Legs",
    secondaryMuscles: ["Glutes", "Core"],
    equipment: "Bodyweight",
    difficulty: "Beginner",
    instructions: [
      "Stand with feet hip-width apart",
      "Step forward with one leg",
      "Lower hips until both knees are at 90 degrees",
      "Push back to starting position",
    ],
    tips: [
      "Keep front knee over ankle",
      "Maintain upright torso",
      "Alternate legs or complete one side first",
    ],
  },
  {
    name: "Bicep Curls",
    description: "Isolation exercise for bicep development",
    category: "Strength",
    muscle: "Biceps",
    equipment: "Dumbbell",
    difficulty: "Beginner",
    instructions: [
      "Stand with dumbbells at sides, palms forward",
      "Curl weights up to shoulders",
      "Squeeze biceps at top",
      "Lower with control to starting position",
    ],
    tips: [
      "Keep elbows stationary",
      "Avoid swinging the weights",
      "Full range of motion for best results",
    ],
  },
];

const seedDatabase = async () => {
  try {
    console.log("🌱 Connect to database...");
    await prisma.$connect();

    console.log("🌱 Seeding database...");

    // Clear existing exercises
    await prisma.exercise.deleteMany({ where: { isCustom: false } });
    console.log("✅ Cleared existing default exercises");

    // Insert exercises
    for (const ex of exercises) {
      await prisma.exercise.upsert({
        where: { name: ex.name },
        update: ex,
        create: {
          ...ex,
          isCustom: false,
        },
      });
    }
    console.log(`✅ Seeded ${exercises.length} default exercises`);

    console.log("🎉 Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
