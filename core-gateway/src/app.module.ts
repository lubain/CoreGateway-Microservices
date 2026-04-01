import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        // On récupère la requête entrante pour extraire les headers (ex: le token JWT)
        context: ({ req }) => ({
          authorization: req.headers.authorization,
        }),
      },
      gateway: {
        // IntrospectAndCompose va interroger automatiquement les microservices
        // pour fusionner leurs schémas GraphQL en un seul "Supergraphe".
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            // C'est ici que nous déclarons nos microservices (URLs internes via Docker idéalement)
            { name: 'users', url: 'http://localhost:3001/graphql' },
            { name: 'orders', url: 'http://localhost:3002/graphql' },
          ],
        }),

        // buildService permet d'intercepter la requête AVANT qu'elle ne soit
        // envoyée au microservice concerné. C'est crucial pour l'authentification.
        buildService({ name, url }) {
          return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }) {
              // Si un token d'autorisation a été reçu par la Gateway,
              // on le transfère au microservice pour qu'il sache "qui" fait la requête.
              if (context.authorization && request.http) {
                request.http.headers.set(
                  'authorization',
                  context.authorization,
                );
              }
            },
          });
        },
      },
    }),
  ],
})
export class AppModule {}
