import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Concert, ConcertSchema } from './concert.schema';
import { ConcertsService } from './concerts.service';
import { ConcertsController } from './concerts.controller';
import { FavoritesModule } from '../favorites/favorites.module';
import { MailModule } from '../mail/mail.module';
import { UsersModule } from '../users/users.module';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Concert.name, schema: ConcertSchema }]),
    FavoritesModule,
    MailModule,
    UsersModule,
    GroupsModule,
  ],
  controllers: [ConcertsController],
  providers: [ConcertsService],
  exports: [ConcertsService],
})
export class ConcertsModule {}
