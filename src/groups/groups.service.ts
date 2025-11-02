import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto } from './dto/create-group.dto';
// import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  async create(dto: CreateGroupDto): Promise<Group> {
    const group = new this.groupModel(dto);
    return group.save();
  }

  async findAll(): Promise<Group[]> {
    return this.groupModel.find().exec();
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupModel
      .findById(id)
      .populate('concerts')
      .exec();
    if (!group) throw new NotFoundException('Group non trouvé');
    return group;
  }

  async update(id: string, dto: CreateGroupDto): Promise<Group> {
    const group = await this.groupModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async remove(id: string): Promise<void> {
    const result = await this.groupModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Group not found');
  }
}
