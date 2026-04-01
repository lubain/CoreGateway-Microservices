import { Module } from '@nestjs/common';
import { OrdersService } from './order.service';
import { OrdersResolver, UserReferenceResolver } from './order.resolver';

@Module({
  providers: [OrdersService, OrdersResolver, UserReferenceResolver],
  exports: [OrdersService],
})
export class OrdersModule {}
