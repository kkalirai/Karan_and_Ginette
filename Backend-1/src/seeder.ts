import { NestFactory } from '@nestjs/core';
import { SeederModule } from 'src/modules/Seeder/seeder.module';
import { SeederService } from 'src/modules/Seeder/Seeder.service';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);

  const seederService = appContext.get(SeederService);

  try {
    console.log('Starting database seeding...');
    await seederService.run();
    console.log('Seeding successful!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
