import { SetMetadata } from '@nestjs/common';

//Uses the jwt AuthF=Guard impmlementation just like Public
export const IS_CLOSED_KEY = 'isClosed';
export const Closed = () => SetMetadata(IS_CLOSED_KEY, true);