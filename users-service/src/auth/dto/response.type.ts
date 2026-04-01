import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResponseType {
  @Field()
  accessToken: string;

  @Field()
  expiresIn: string;
}
