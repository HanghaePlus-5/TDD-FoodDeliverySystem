import { UserTypeGuard } from './user-type.guard';

describe('AuthGuard', () => {
  it('should be defined', () => {
    expect(new UserTypeGuard()).toBeDefined();
  });
});
