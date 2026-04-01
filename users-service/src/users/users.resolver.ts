import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveReference,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Public } from '../auth/public.decorator';
import { AuthGuard } from '../auth/Auth.guard';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // ─── Queries (publiques) ─────────────────────────────────────────────────────

  @Public()
  @Query(() => [User], {
    name: 'users',
    description: 'Récupère tous les utilisateurs',
  })
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Public()
  @Query(() => User, {
    name: 'user',
    description: 'Récupère un utilisateur par son ID',
  })
  findOne(@Args('id') id: string): User {
    return this.usersService.findOne(id);
  }

  // ─── Mutations (protégées par JWT) ────────────────────────────────────────────

  @UseGuards(AuthGuard)
  @Mutation(() => User, {
    description: 'Crée un nouvel utilisateur',
  })
  createUser(@Args('input') input: CreateUserInput): User {
    return this.usersService.create(input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User, {
    description: 'Met à jour un utilisateur existant',
  })
  updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserInput,
  ): User {
    return this.usersService.update(id, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean, { description: 'Supprime un utilisateur' })
  removeUser(@Args('id') id: string): boolean {
    return this.usersService.remove(id);
  }

  // ─── Federation ──────────────────────────────────────────────────────────────

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }): User {
    return this.usersService.findOne(reference.id);
  }
}
