import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Order, OrderItem } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderStatusInput } from './dto/update-order.input';

const VALID_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

/**
 * Simulation d'une base de données en mémoire.
 * À remplacer par un vrai ORM (TypeORM, Prisma, Mongoose...) en production.
 */
@Injectable()
export class OrdersService {
  private orders: Order[] = [
    {
      id: '101',
      user: { id: '1' },
      items: [
        {
          productId: 'prod-1',
          productName: 'Laptop Pro',
          price: 1299.99,
          quantity: 1,
        },
        {
          productId: 'prod-5',
          productName: 'Souris sans fil',
          price: 29.99,
          quantity: 2,
        },
      ],
      totalAmount: 1359.97,
      status: 'DELIVERED',
      createdAt: new Date('2024-03-01').toISOString(),
      updatedAt: new Date('2024-03-05').toISOString(),
    },
    {
      id: '102',
      user: { id: '2' },
      items: [
        {
          productId: 'prod-3',
          productName: 'Clavier mécanique',
          price: 149.99,
          quantity: 1,
        },
      ],
      totalAmount: 149.99,
      status: 'SHIPPED',
      createdAt: new Date('2024-03-15').toISOString(),
      updatedAt: new Date('2024-03-16').toISOString(),
    },
    {
      id: '103',
      user: { id: '1' },
      items: [
        {
          productId: 'prod-7',
          productName: 'Webcam HD',
          price: 79.99,
          quantity: 1,
        },
        {
          productId: 'prod-8',
          productName: 'Micro USB',
          price: 39.99,
          quantity: 1,
        },
      ],
      totalAmount: 119.98,
      status: 'PENDING',
      createdAt: new Date('2024-03-20').toISOString(),
    },
  ];

  private idCounter = 104;

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: string): Order {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new NotFoundException(`Commande avec l'id "${id}" introuvable.`);
    }
    return order;
  }

  findByUser(userId: string): Order[] {
    return this.orders.filter((o) => o.user.id === userId);
  }

  create(input: CreateOrderInput): Order {
    if (!input.items || input.items.length === 0) {
      throw new BadRequestException(
        'Une commande doit contenir au moins un article.',
      );
    }

    const items: OrderItem[] = input.items.map((item) => ({
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const newOrder: Order = {
      id: String(this.idCounter++),
      user: { id: input.userId },
      items,
      totalAmount: Math.round(totalAmount * 100) / 100,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  updateStatus(id: string, input: UpdateOrderStatusInput): Order {
    if (!VALID_STATUSES.includes(input.status)) {
      throw new BadRequestException(
        `Statut invalide. Valeurs autorisées : ${VALID_STATUSES.join(', ')}`,
      );
    }

    const order = this.findOne(id);
    order.status = input.status;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  cancel(id: string): Order {
    const order = this.findOne(id);
    if (order.status === 'DELIVERED') {
      throw new BadRequestException(
        "Impossible d'annuler une commande déjà livrée.",
      );
    }
    order.status = 'CANCELLED';
    order.updatedAt = new Date().toISOString();
    return order;
  }

  remove(id: string): boolean {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new NotFoundException(`Commande avec l'id "${id}" introuvable.`);
    }
    this.orders.splice(index, 1);
    return true;
  }
}
