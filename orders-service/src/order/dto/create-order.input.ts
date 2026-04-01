import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class OrderItemInput {
  @Field()
  productId: string;

  @Field()
  productName: string;

  @Field(() => Float)
  price: number;

  @Field()
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field()
  userId: string;

  @Field(() => [OrderItemInput])
  items: OrderItemInput[];
}
