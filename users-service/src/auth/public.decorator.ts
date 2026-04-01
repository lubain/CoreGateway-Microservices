import { SetMetadata } from '@nestjs/common';

/**
 * Décorateur pour marquer un resolver comme public (sans auth requise).
 * Usage : @Public() au-dessus d'une @Query ou @Mutation
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
