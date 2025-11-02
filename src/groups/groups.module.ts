import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupService } from './groups.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './entities/group.entity';
import { Concert, ConcertSchema } from 'src/concerts/concert.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
    MongooseModule.forFeature([{ name: Concert.name, schema: ConcertSchema }]),
  ],
  controllers: [GroupsController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupsModule {}
