import * as bcrypt from 'bcrypt';

import { bcryptCompare } from './compare';
import { bcryptHash } from './hash';

describe('bcrypt', () => {
  describe('hash', () => {
    const SALT_ROUND = 8;
    const PLAIN = 'plain';
    const HASHED = 'HASHED';

    const spyHash = jest.spyOn(bcrypt, 'hash')
      .mockImplementationOnce(() => Promise.resolve(HASHED))
      .mockImplementationOnce(() => Promise.reject(new Error()));

    it('should return a hashed string.', async () => {
      const result = await bcryptHash(PLAIN);
      expect(spyHash).toBeCalledWith(PLAIN, SALT_ROUND);
      expect(result).toBe(HASHED);
    });

    it('should throw an error if hash fails internally.', async () => {
      await expect(bcryptHash(PLAIN)).rejects.toThrow();
      expect(spyHash).toBeCalledWith(PLAIN, SALT_ROUND);
    });
  });

  describe('compare', () => {
    const PLAIN = 'plain';
    const WRONG_PLAIN = 'plain2';
    const HASHED = 'HASHED';

    const spyCompare = jest.spyOn(bcrypt, 'compare')
      .mockImplementationOnce(() => Promise.resolve(true))
      .mockImplementationOnce(() => Promise.resolve(false))
      .mockImplementationOnce(() => Promise.reject(new Error()));

    it('should return true if plain and hashed are matched.', async () => {
      const result = await bcryptCompare(PLAIN, HASHED);
      expect(spyCompare).toBeCalledWith(PLAIN, HASHED);
      expect(result).toBe(true);
    });

    it('should return false if plain and hashed are not matched.', async () => {
      const result = await bcryptCompare(WRONG_PLAIN, HASHED);
      expect(spyCompare).toBeCalledWith(WRONG_PLAIN, HASHED);
      expect(result).toBe(false);
    });

    it('should throw an error if compare fails internally.', async () => {
      await expect(bcryptCompare(PLAIN, HASHED)).rejects.toThrow();
      expect(spyCompare).toBeCalledWith(PLAIN, HASHED);
    });
  });
});
