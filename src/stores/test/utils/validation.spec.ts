import { checkMenuStatusChangeCondition } from 'src/stores/utils/validation';

describe('checkMenuStatusChangeCondition', () => {
  it('should return false if [REGISTERED -> CLOSED]', () => {
    const result = checkMenuStatusChangeCondition(
      'REGISTERED' as MenuStatus,
      'CLOSED' as MenuStatus,
    );
    expect(result).toBe(false);
  });

  it('should return false if [OPEN -> REGISTERED]', () => {
    const result = checkMenuStatusChangeCondition(
      'OPEN' as MenuStatus,
      'REGISTERED' as MenuStatus,
    );
    expect(result).toBe(false);
  });

  it('should return true if [REGISTERED -> OPEN]', () => {
    const result = checkMenuStatusChangeCondition(
      'REGISTERED' as MenuStatus,
      'OPEN' as MenuStatus,
    );
    expect(result).toBe(true);
  });
});
