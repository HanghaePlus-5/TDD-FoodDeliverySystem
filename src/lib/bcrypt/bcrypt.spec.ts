import * as bcrypt from 'bcrypt';
import { bcryptHash } from './hash';
import { bcryptCompare } from './compare';

describe('bcrypt', () => {
  describe('hash', () => {
    const SALT_ROUND = 10;
    const plain = 'plain';
    const HASHED = 'HASHED';

    const spyHash = jest.spyOn(bcrypt, 'hash')
      .mockImplementationOnce(async (plain: string) => Promise.resolve(HASHED))
      .mockImplementationOnce(async (plain: string) => Promise.reject(new Error()));

    it('should return a hashed string.', async () => {
      const result = await bcryptHash(plain);
      expect(spyHash).toBeCalledWith(plain, SALT_ROUND);
      expect(result).toBe(HASHED);
    });

    it('should throw an error if hash fails internally.', async () => {
      await expect(bcryptHash(plain)).rejects.toThrow();
      expect(spyHash).toBeCalledWith(plain, SALT_ROUND);
    });
  });

  describe('compare', () => {});
});