import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Favorite } from './favorite.schema';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
  ) {}

  async addFavorite(userId: string, groupId: string): Promise<Favorite> {
    try {
      const favorite = new this.favoriteModel({
        user: new Types.ObjectId(userId),
        group: new Types.ObjectId(groupId),
      });
      return await favorite.save();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000) {
        throw new ConflictException('This group is already in your favorites');
      }
      throw error;
    }
  }

  async removeFavorite(
    userId: string,
    groupId: string,
  ): Promise<Favorite | null> {
    const result = await this.favoriteModel
      .findOneAndDelete({
        user: new Types.ObjectId(userId),
        group: new Types.ObjectId(groupId),
      })
      .exec();

    if (!result) {
      throw new NotFoundException('Favorite not found');
    }

    return result;
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return await this.favoriteModel
      .find({ user: new Types.ObjectId(userId) })
      .populate('group')
      .exec();
  }

  async isGroupFavorite(userId: string, groupId: string): Promise<boolean> {
    const favorite = await this.favoriteModel
      .findOne({
        user: new Types.ObjectId(userId),
        group: new Types.ObjectId(groupId),
      })
      .exec();

    return !!favorite;
  }

  async getUsersWhoFavoritedGroup(groupId: string): Promise<string[]> {
    const favorites = await this.favoriteModel
      .find({ group: new Types.ObjectId(groupId) })
      .exec();

    return favorites.map(fav => fav.user.toString());
  }
}