import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import { create } from 'express-handlebars';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { MailService } from './mail/mail.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  const hbsEngine = create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: join(__dirname, '..', 'views/layouts'),
    partialsDir: join(__dirname, '..', 'views/partials'),
    helpers: {
      uppercase: (str: string) => str.toUpperCase(),
      formatDate: (date: Date) => {
        if (!date) return '';
        const d = new Date(date);
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ];
        return `${d.getDate()} ${months[d.getMonth()]}`;
      },
      calculatePercentage: (available: number, total: number) => {
        if (!total || total === 0) return 0;
        return Math.round((available / total) * 100);
      },
      eq: (a: any, b: any) => a === b,
      formatdate: (date: string | Date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      },
      json: function (context: any) {
        return JSON.stringify(context);
      },
    },
  });
  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.engine('hbs', hbsEngine.engine);
  app.setViewEngine('hbs');
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  const mailService = app.get(MailService);
  const isConnected = await mailService.testConnection();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
