import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking } from './booking.schema';
import { Concert } from '../concerts/concert.schema';
import { PopulatedBooking } from './booking.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Concert.name) private concertModel: Model<Concert>,
  ) {}

  async findAll(): Promise<PopulatedBooking[]> {
    try {
      const toutesLesReservations = await this.bookingModel
        .find()
        .populate('concertId', 'title date price image')
        .populate('userId', 'username email')
        .lean()
        .exec();

      return toutesLesReservations as unknown as PopulatedBooking[];
    } catch (erreur) {
      console.error('Erreur findAll:', erreur);
      return [];
    }
  }

  async createBooking(userId, concertId, quantity: number) {
    try {
      const concert = await this.concertModel.findById(concertId);

      if (!concert) {
        return {
          success: false,
          message: 'Concert not found',
        };
      }

      if (quantity > concert.availableSeats) {
        return {
          success: false,
          message: 'Not enough available seats',
        };
      }

      const amount = quantity * concert.price;

      const newBooking = await this.bookingModel.create({
        userId: new Types.ObjectId(userId),
        concertId: new Types.ObjectId(concertId),
        quantity,
        amount,
      });

      concert.availableSeats -= quantity;
      await concert.save();

      return {
        success: true,
        message: 'Event booked successfully',
        booking: newBooking,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Booking failed',
        error: error.message,
      };
    }
  }

  async getBookingByUser(userId: string): Promise<{
    success: boolean;
    message?: string;
    bookings: PopulatedBooking[];
  }> {
    try {
      const objectId = new Types.ObjectId(userId);

      const bookings = await this.bookingModel
        .find({ userId: objectId })
        .populate('concertId', 'title date price image')
        .populate('userId', 'username')
        .lean()
        .exec();

      if (!bookings || bookings.length === 0) {
        return {
          success: false,
          message: 'No bookings found for this user',
          bookings: [],
        };
      }

      return {
        success: true,
        bookings: bookings as unknown as PopulatedBooking[],
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to get bookings',
        bookings: [],
      };
    }
  }

  async cancelBooking(bookingId: string) {
    try {
      const booking = await this.bookingModel.findById(bookingId);
      if (!booking) {
        return {
          success: false,
          message: 'Booking not found!',
        };
      }

      const concert = await this.concertModel.findById(booking.concertId);

      if (concert) {
        concert.availableSeats += booking.quantity;
        await concert.save();
      }

      await this.bookingModel.findByIdAndDelete(bookingId);

      return {
        success: true,
        message: 'Booking cancelled successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to cancel booking',
        error: error.message,
      };
    }
  }
}
