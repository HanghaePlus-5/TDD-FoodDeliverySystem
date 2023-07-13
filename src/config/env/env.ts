export const env = () => ({
  NODE_ENV: process.env.NODE_ENV === 'production' ? 'production' : 'dev',
  
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

  AWS_CLOUDWATCH_LOG_GROUP_NAME: process.env.AWS_CLOUDWATCH_LOG_GROUP_NAME,
  AWS_CLOUDWATCH_LOG_STREAM_NAME: process.env.AWS_CLOUDWATCH_LOG_STREAM_NAME,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
});
