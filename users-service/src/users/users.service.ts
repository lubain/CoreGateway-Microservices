import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

/**
 * Simulation d'une base de données en mémoire.
 * À remplacer par un vrai ORM (TypeORM, Prisma, Mongoose...) en production.
 */
@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      name: 'Alice Dupont',
      email: 'alice@example.com',
      role: 'ADMIN',
      createdAt: new Date('2024-01-15').toISOString(),
    },
    {
      id: '2',
      name: 'Bob Martin',
      email: 'bob@example.com',
      role: 'USER',
      createdAt: new Date('2024-02-20').toISOString(),
    },
    {
      id: '3',
      name: 'Clara Leroy',
      email: 'clara@example.com',
      role: 'USER',
      createdAt: new Date('2024-03-10').toISOString(),
    },
  ];

  private idCounter = 4;

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'id "${id}" introuvable.`);
    }
    return user;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email);
  }

  create(input: CreateUserInput): User {
    const existing = this.findByEmail(input.email);
    if (existing) {
      throw new Error(
        `Un utilisateur avec l'email "${input.email}" existe déjà.`,
      );
    }

    const newUser: User = {
      id: String(this.idCounter++),
      name: input.name,
      email: input.email,
      role: input.role ?? 'USER',
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return newUser;
  }

  update(id: string, input: UpdateUserInput): User {
    const user = this.findOne(id);

    if (input.name !== undefined) user.name = input.name;
    if (input.email !== undefined) user.email = input.email;
    if (input.role !== undefined) user.role = input.role;

    return user;
  }

  remove(id: string): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`Utilisateur avec l'id "${id}" introuvable.`);
    }
    this.users.splice(index, 1);
    return true;
  }
}
