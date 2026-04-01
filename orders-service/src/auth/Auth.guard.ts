import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './Public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Vérifie si le resolver est marqué @Public() → on laisse passer sans vérification
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { authorization } = ctx.getContext();

    if (!authorization) {
      throw new UnauthorizedException("Token d'authentification manquant.");
    }

    const token = authorization.replace('Bearer ', '').trim();

    if (!token) {
      throw new UnauthorizedException('Token invalide.');
    }

    try {
      // Vérifie la signature JWT et décode le payload
      const payload = this.jwtService.verify(token);

      // On attache le payload décodé au contexte GraphQL
      // Il sera accessible via @Context() dans les resolvers
      ctx.getContext().user = payload;

      return true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expiré.');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Token invalide ou mal formé.');
      }
      throw new UnauthorizedException("Échec de l'authentification.");
    }
  }
}
