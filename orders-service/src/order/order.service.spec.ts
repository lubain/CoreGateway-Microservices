import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrdersService } from './order.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  // ─── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('doit retourner la liste de toutes les commandes', () => {
      const orders = service.findAll();
      expect(orders).toBeInstanceOf(Array);
      expect(orders.length).toBeGreaterThan(0);
    });
  });

  // ─── findOne ────────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('doit retourner une commande existante', () => {
      const order = service.findOne('101');
      expect(order).toBeDefined();
      expect(order.id).toBe('101');
    });

    it("doit lever NotFoundException si l'ID n'existe pas", () => {
      expect(() => service.findOne('9999')).toThrow(NotFoundException);
    });
  });

  // ─── findByUser ─────────────────────────────────────────────────────────────

  describe('findByUser', () => {
    it("doit retourner les commandes d'un utilisateur donné", () => {
      const orders = service.findByUser('1');
      expect(orders.every((o) => o.user.id === '1')).toBe(true);
    });

    it('doit retourner un tableau vide pour un utilisateur sans commandes', () => {
      const orders = service.findByUser('99999');
      expect(orders).toEqual([]);
    });
  });

  // ─── create ─────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('doit créer une commande et calculer le total', () => {
      const order = service.create({
        userId: '3',
        items: [
          {
            productId: 'p1',
            productName: 'Produit A',
            price: 10.0,
            quantity: 2,
          },
          {
            productId: 'p2',
            productName: 'Produit B',
            price: 5.5,
            quantity: 1,
          },
        ],
      });
      expect(order.totalAmount).toBe(25.5);
      expect(order.status).toBe('PENDING');
      expect(order.user.id).toBe('3');
    });

    it('doit lever une erreur si la commande est vide', () => {
      expect(() => service.create({ userId: '1', items: [] })).toThrow(
        BadRequestException,
      );
    });
  });

  // ─── updateStatus ────────────────────────────────────────────────────────────

  describe('updateStatus', () => {
    it('doit mettre à jour le statut', () => {
      const order = service.updateStatus('103', { status: 'CONFIRMED' });
      expect(order.status).toBe('CONFIRMED');
      expect(order.updatedAt).toBeDefined();
    });

    it('doit lever une erreur pour un statut invalide', () => {
      expect(() => service.updateStatus('101', { status: 'INVALIDE' })).toThrow(
        BadRequestException,
      );
    });
  });

  // ─── cancel ─────────────────────────────────────────────────────────────────

  describe('cancel', () => {
    it('doit annuler une commande PENDING', () => {
      const order = service.cancel('103');
      expect(order.status).toBe('CANCELLED');
    });

    it('doit lever une erreur si la commande est déjà livrée', () => {
      expect(() => service.cancel('101')).toThrow(BadRequestException);
    });
  });

  // ─── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('doit supprimer une commande et retourner true', () => {
      const result = service.remove('102');
      expect(result).toBe(true);
      expect(() => service.findOne('102')).toThrow(NotFoundException);
    });

    it("doit lever NotFoundException si la commande n'existe pas", () => {
      expect(() => service.remove('9999')).toThrow(NotFoundException);
    });
  });
});
