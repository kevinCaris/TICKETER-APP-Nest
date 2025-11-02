import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Concert } from './concert.schema';
import { FavoritesService } from '../favorites/favorites.service';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
@Injectable()
export class ConcertsService {
  constructor(
    @InjectModel(Concert.name) private concertModel: Model<Concert>,
    private favoritesService: FavoritesService,
    private mailService: MailService,
    private usersService: UsersService,
  ) {}
  // async create(concertData: Partial<Concert>): Promise<Concert> {
  //   const newConcert = new this.concertModel(concertData);
  //   return await newConcert.save();
  // }
  async create(concertData: Partial<Concert>): Promise<Concert> {
    const newConcert = new this.concertModel(concertData);
    const savedConcert = await newConcert.save();

    // Envoyer des notifications aux fans de ce groupe
    try {
      const userIds = await this.favoritesService.getUsersWhoFavoritedGroup(
        concertData.group?.toString() || '',
      ); 
      if (userIds.length > 0) {
        const users = await this.usersService.findByIds(userIds);

        // Envoyer un email à chaque utilisateur
        for (const user of users) {
          await this.mailService.sendConcertNotification(
            user.email,
            savedConcert,
          );
        }

        console.log(`Notifications envoyées à ${users.length} utilisateurs`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des notifications:", error);
      // On ne bloque pas la création du concert si l'envoi échoue
    }

    return savedConcert;
  }
  async findAll(): Promise<Concert[]> {
    return await this.concertModel.find().exec();
  }
  async findOne(id: string): Promise<Concert | null> {
    return await this.concertModel.findById(id).exec();
  }
  async getUniqueGenres(): Promise<string[]> {
    const genres = await this.concertModel.distinct('genre').exec();
    return genres.sort();
  }
  async update(
    id: string,
    updateData: Partial<Concert>,
  ): Promise<Concert | null> {
    return await this.concertModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }
  async delete(id: string): Promise<Concert | null> {
    return await this.concertModel.findByIdAndDelete(id).exec();
  }
  async findWithFilters(filters: {
    genre?: string;
    date?: string;
    group?: string;
  }): Promise<Concert[]> {
    const query: any = {};

    if (filters.genre) {
      query.genre = filters.genre;
    }

    if (filters.date) {
      query.date = new Date(filters.date);
    }

    if (filters.group) {
      query.group = filters.group;
    }

    return await this.concertModel.find(query).exec();
  }
}
