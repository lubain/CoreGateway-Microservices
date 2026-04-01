import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // ─── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('doit retourner la liste de tous les utilisateurs', () => {
      const users = service.findAll();
      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBeGreaterThan(0);
    });
  });

  // ─── findOne ────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('doit retourner un utilisateur existant', () => {
      const user = service.findOne('1');
      expect(user).toBeDefined();
      expect(user?.id).toBe('1');
    });

    it("doit lever une NotFoundException si l'ID n'existe pas", () => {
      expect(() => service.findOne('9999')).toThrow(NotFoundException);
    });
  });

  // ─── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('doit créer un nouvel utilisateur', () => {
      const before = service.findAll().length;
      const user = service.create({
        name: 'Test User',
        email: 'test@example.com',
        role: 'USER',
      });

      expect(user.id).toBeDefined();
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(service.findAll().length).toBe(before + 1);
    });

    it("doit lever une erreur si l'email est déjà utilisé", () => {
      expect(() =>
        service.create({ name: 'Dup', email: 'alice@example.com' }),
      ).toThrow();
    });
  });

  // ─── update ─────────────────────────────────────────────────────────────────

  describe('update', () => {
    it('doit mettre à jour un utilisateur existant', () => {
      const user = service.update('2', { name: 'Bob Updated' });
      expect(user.name).toBe('Bob Updated');
    });

    it("doit lever NotFoundException si l'utilisateur n'existe pas", () => {
      expect(() => service.update('9999', { name: 'X' })).toThrow(
        NotFoundException,
      );
    });
  });

  // ─── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('doit supprimer un utilisateur et retourner true', () => {
      service.create({ name: 'ToDelete', email: 'delete@example.com' });
      const all = service.findAll();
      const last = all[all.length - 1];
      const result = service.remove(last.id);
      expect(result).toBe(true);
    });

    it("doit lever NotFoundException si l'utilisateur n'existe pas", () => {
      expect(() => service.remove('9999')).toThrow(NotFoundException);
    });
  });
});
