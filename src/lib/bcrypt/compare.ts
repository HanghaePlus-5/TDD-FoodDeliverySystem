import * as bcrypt from 'bcrypt';

export const bcryptCompare = async (plain: string, hashed: string): Promise<boolean> => {
    try {
        return bcrypt.compare(plain, hashed);
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`bcrypt compare error. ${error.name}: ${error.message}`);
        }
        throw new Error('bcrypt compare error.');
    }
};
