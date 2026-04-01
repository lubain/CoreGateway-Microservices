import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './order.service';
import { OrdersResolver, UserReferenceResolver } from './order.resolver';

describe('OrdersResolver', () => {
  let resolver: OrdersResolver;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersResolver, UserReferenceResolver, OrdersService],
    }).compile();

    resolver = module.get<OrdersResolver>(OrdersResolver);
    service = module.get<OrdersService>(OrdersService);
  });

  it('doit être défini', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('doit retourner un tableau de commandes', () => {
      const result = resolver.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('doit retourner une commande par ID', () => {
      const order = resolver.findOne('101');
      expect(order.id).toBe('101');
    });
  });

  describe('findByUser', () => {
    it('doit filtrer les commandes par userId', () => {
      const orders = resolver.findByUser('1');
      expect(orders.every((o) => o.user.id === '1')).toBe(true);
    });
  });

  describe('createOrder', () => {
    it('doit appeler le service avec les bons arguments', () => {
      const spy = jest.spyOn(service, 'create');
      const input = {
        userId: '2',
        items: [
          { productId: 'p1', productName: 'Item', price: 20, quantity: 1 },
        ],
      };
      resolver.createOrder(input);
      expect(spy).toHaveBeenCalledWith(input);
    });
  });

  describe('resolveReference', () => {
    it('doit résoudre une référence de fédération', () => {
      const order = resolver.resolveReference({
        __typename: 'Order',
        id: '101',
      });
      expect(order.id).toBe('101');
    });
  });
});
