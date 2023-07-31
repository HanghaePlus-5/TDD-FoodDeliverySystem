import * as bcrypt from 'bcrypt';

export const bcryptHash = async (plain: string): Promise<string> => {
  try {
    return bcrypt.hash(plain, 8);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`bcrypt hash error. ${error.name}: ${error.message}`);
    }
    throw new Error('bcrypt hash error.');
  }
};
