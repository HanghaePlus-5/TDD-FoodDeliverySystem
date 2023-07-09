export const env = () => ({
  /**
   * Prisma
   */
  DATABASE_URL: process.env.DATABASE_URL,

  /**
   * Security
   */
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  /**
   * Stores Business Logic
   */
  MIN_COOKING_TIME: Number(process.env.MIN_COOKING_TIME),
  MAX_COOKING_TIME: Number(process.env.MAX_COOKING_TIME),
  BUSINESS_NUMBER_CHECK_API_KEY: process.env.BUSINESS_NUMBER_CHECK_API_KEY,
});
