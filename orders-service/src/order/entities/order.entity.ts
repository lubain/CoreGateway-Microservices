import { ObjectType, Field, ID, Float, Directive } from '@nestjs/graphql';

/**
 * Référence à l'entité User définie dans le Users Service.
 * Apollo Federation va résoudre ce lien automatiquement via @key(fields: "id").
 */
@ObjectType()
@Directive('@key(fields: "id")')
export class UserReference {
  @Field(() => ID)
  id: string;
}

@ObjectType()
export class OrderItem {
  @Field()
  productId: string;

  @Field()
  productName: string;

  @Field(() => Float)
  price: number;

  @Field()
  quantity: number;
}

@ObjectType()
@Directive('@key(fields: "id")')
export class Order {
  @Field(() => ID)
  id: string;

  @Field(() => UserReference, {
    description: 'Utilisateur ayant passé la commande',
  })
  user: UserReference;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field(() => Float)
  totalAmount: number;

  @Field()
  status: string; // PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED

  @Field()
  createdAt: string;

  @Field({ nullable: true })
  updatedAt?: string;
}
