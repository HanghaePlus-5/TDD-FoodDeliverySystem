import { SetMetadata } from '@nestjs/common';

export const UserTypes = (...userTypes: UserType[]) => SetMetadata('userType', userTypes);
