import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UncaughtExceptionFilter } from './filters/uncaughtException.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
    app.useGlobalFilters(new UncaughtExceptionFilter());
    app.setGlobalPrefix('api');

    await app.listen(Number(process.env.PORT) || 3001);
}
bootstrap();
