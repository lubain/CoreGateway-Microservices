import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Vérifie les credentials et retourne un JWT signé.
   * TODO: En production, comparer un hash bcrypt et non un mot de passe en clair.
   * npm install bcrypt @types/bcrypt
   * const isValid = await bcrypt.compare(password, user.passwordHash);
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // 1. Retrouver l'utilisateur par email
    const user = this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    // 2. Vérifier le mot de passe
    // TODO: remplacer par bcrypt.compare(password, user.passwordHash)
    const isPasswordValid = password === 'password'; // temporaire pour les tests
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect.');
    }

    // 3. Construire le payload JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role ?? 'USER',
    };

    // 4. Signer et retourner le token
    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: '1h',
    };
  }

  /**
   * Valide un payload JWT décodé (utilisé par AuthGuard si besoin).
   */
  validatePayload(payload: JwtPayload) {
    return this.usersService.findOne(payload.sub);
  }
}
