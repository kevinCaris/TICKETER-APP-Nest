import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { MailService } from 'src/mail/mail.service';
import { UpdateProfileDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, isAdmin = false } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
      isAdmin,
    });
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    try {
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const updated = await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      if (!updated) throw new NotFoundException('Utilisateur introuvable');
      return updated;
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la mise à jour',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateProfile(userId: string, updateData: UpdateProfileDto) {
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true });
  }

  async updatePassword(userId: string, hashedPassword: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true },
    );
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Utilisateur introuvable');
  }

  async updateRole(id: string, isAdmin: boolean) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { isAdmin },
      { new: true },
    );
    return user;
  }

  async findByIds(userIds: string[]): Promise<User[]> {
    return await this.userModel
      .find({
        _id: { $in: userIds.map((id) => new Types.ObjectId(id)) },
      })
      .exec();
  }
}
