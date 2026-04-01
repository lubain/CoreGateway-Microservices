import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveReference,
} from '@nestjs/graphql';
import { Order, UserReference } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderStatusInput } from './dto/update-order.input';
import { OrdersService } from './order.service';

// ─── Resolver pour l'entité User (référencée depuis Orders) ──────────────────
@Resolver(() => UserReference)
export class UserReferenceResolver {
  /**
   * Permet à Apollo Federation de résoudre la référence User
   * quand le champ "user" d'une Order est demandé.
   * La résolution réelle (données complètes) se fait via le Users Service.
   */
  @ResolveReference()
  resolveReference(reference: {
    __typename: string;
    id: string;
  }): UserReference {
    return { id: reference.id };
  }
}

// ─── Resolver principal Orders ────────────────────────────────────────────────
@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  // ─── Queries ────────────────────────────────────────────────────────────────

  @Query(() => [Order], {
    name: 'orders',
    description: 'Récupère toutes les commandes',
  })
  findAll(): Order[] {
    return this.ordersService.findAll();
  }

  @Query(() => Order, {
    name: 'order',
    description: 'Récupère une commande par son ID',
  })
  findOne(@Args('id') id: string): Order {
    return this.ordersService.findOne(id);
  }

  @Query(() => [Order], {
    name: 'ordersByUser',
    description: "Récupère toutes les commandes d'un utilisateur",
  })
  findByUser(@Args('userId') userId: string): Order[] {
    return this.ordersService.findByUser(userId);
  }

  // ─── Mutations ───────────────────────────────────────────────────────────────

  @Mutation(() => Order, { description: 'Crée une nouvelle commande' })
  createOrder(@Args('input') input: CreateOrderInput): Order {
    return this.ordersService.create(input);
  }

  @Mutation(() => Order, { description: "Met à jour le statut d'une commande" })
  updateOrderStatus(
    @Args('id') id: string,
    @Args('input') input: UpdateOrderStatusInput,
  ): Order {
    return this.ordersService.updateStatus(id, input);
  }

  @Mutation(() => Order, { description: 'Annule une commande' })
  cancelOrder(@Args('id') id: string): Order {
    return this.ordersService.cancel(id);
  }

  @Mutation(() => Boolean, { description: 'Supprime une commande' })
  removeOrder(@Args('id') id: string): boolean {
    return this.ordersService.remove(id);
  }

  // ─── Federation ──────────────────────────────────────────────────────────────

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }): Order {
    return this.ordersService.findOne(reference.id);
  }
}
