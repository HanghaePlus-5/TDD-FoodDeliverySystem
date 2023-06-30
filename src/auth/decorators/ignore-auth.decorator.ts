import { SetMetadata } from '@nestjs/common';

export const IGNORE_AUTH_KEY = 'IGNORE_AUTH_KEY';
export const IgnoreAuth = () => SetMetadata(IGNORE_AUTH_KEY, true);
