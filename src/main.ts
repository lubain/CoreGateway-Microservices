import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activer les CORS au niveau global de l'application NestJS
  app.enableCors();

  // Le port de notre API Gateway
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(
    `API Gateway (Supergraph) démarrée sur http://localhost:${PORT}/graphql`,
  );
  console.log(
    `Assurez-vous que les microservices (ports 3001, 3002) tournent, sinon la Gateway affichera des erreurs au démarrage.`,
  );
}
bootstrap();
