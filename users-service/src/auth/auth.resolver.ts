import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { LoginResponseType } from './dto/response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * Mutation publique : ne nécessite pas de token JWT.
   * Retourne un accessToken à utiliser dans les headers suivants :
   * Authorization: Bearer <accessToken>
   *
   * Exemple GraphQL :
   * mutation {
   *   login(email: "alice@example.com", password: "password") {
   *     accessToken
   *     expiresIn
   *   }
   * }
   */
  @Public()
  @Mutation(() => LoginResponseType, {
    description: 'Authentifie un utilisateur et retourne un token JWT.',
  })
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<LoginResponseType> {
    return this.authService.login(email, password);
  }
}
