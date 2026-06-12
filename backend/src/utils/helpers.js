/**
 * Async handler wrapper
 * Eliminates need for try-catch blocks in async route handlers
 * @param {Function} fn - Async function to wrap
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Create paginated response for Prisma
 * @param {Object} prismaModel - Prisma model delegate (e.g., prisma.user)
 * @param {Object} args - Prisma findMany arguments (where, include, etc.)
 * @param {Object} options - Pagination options
 */
export const paginate = async (prismaModel, args = {}, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;

  const skip = (page - 1) * limit;
  const total = await prismaModel.count({ where: args.where || {} });

  const results = await prismaModel.findMany({
    ...args,
    take: limit,
    skip: skip,
    orderBy: args.orderBy || { createdAt: 'desc' },
  });

  const pagination = {
    current: page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };

  const startIndex = skip;
  const endIndex = page * limit;

  if (endIndex < total) {
    pagination.next = page + 1;
  }

  if (startIndex > 0) {
    pagination.prev = page - 1;
  }

  return {
    success: true,
    pagination,
    count: results.length,
    data: results,
  };
};

/**
 * Format success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 * @param {string} message - Success message
 */
export const successResponse = (res, statusCode, data, message = "Success") => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Format error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 */
export const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * Calculate one rep max using Epley formula
 * @param {number} weight - Weight lifted
 * @param {number} reps - Number of repetitions
 */
export const calculateOneRepMax = (weight, reps) => {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
};

/**
 * Calculate workout volume
 * @param {Array} exercises - Array of exercises with sets, reps, and weight
 */
export const calculateWorkoutVolume = (exercises) => {
  return exercises.reduce((total, exercise) => {
    const exerciseVolume = exercise.sets.reduce((sum, set) => {
      return sum + set.reps * set.weight;
    }, 0);
    return total + exerciseVolume;
  }, 0);
};

/**
 * Check if dates are on the same day
 * @param {Date} date1
 * @param {Date} date2
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Calculate streak
 * @param {Array} dates - Array of workout dates
 */
export const calculateStreak = (dates) => {
  if (dates.length === 0) return 0;

  // Sort dates in descending order
  const sortedDates = dates.map((d) => new Date(d)).sort((a, b) => b - a);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if most recent workout was today or yesterday
  const mostRecent = new Date(sortedDates[0]);
  mostRecent.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));

  if (daysDiff > 1) return 0;
  if (daysDiff === 0 || daysDiff === 1) streak = 1;

  // Count consecutive days
  for (let i = 1; i < sortedDates.length; i++) {
    const current = new Date(sortedDates[i]);
    current.setHours(0, 0, 0, 0);

    const previous = new Date(sortedDates[i - 1]);
    previous.setHours(0, 0, 0, 0);

    const diff = Math.floor((previous - current) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      streak++;
    } else if (diff > 1) {
      break;
    }
  }

  return streak;
};
