import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateOrderStatusInput {
  @Field()
  status: string; // PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED
}
