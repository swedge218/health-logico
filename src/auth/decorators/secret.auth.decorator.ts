import { SetMetadata } from '@nestjs/common';

//Uses the jwt AuthF=Guard impmlementation just like Public
export const IS_SECRET_AUTH = 'isSecretAuth';
export const SecretAuth = () => SetMetadata(IS_SECRET_AUTH, true);