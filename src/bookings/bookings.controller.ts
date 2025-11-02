import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Render,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ConcertsService } from 'src/concerts/concerts.service';
import { BookingsService } from './bookings.service';
import { BookingDto } from './dto/booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingService: BookingsService,
    private readonly concertService: ConcertsService,
  ) {}

  @Get()
  async findAll() {
    return await this.bookingService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post('booking')
  async bookEvent(@Request() req, @Body() createBookingDto: BookingDto) {
    const { concertId, quantity } = createBookingDto;
    try {
      const booking = await this.bookingService.createBooking(
        req.user.sub,
        concertId,
        quantity,
      );

      return {
        success: true,
        message: 'Réservation effectuée avec succès',
        booking,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erreur de réservation',
        error: error.message,
      };
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':bookingId')
  async cancelBooking(@Param('bookingId') bookingId: string) {
    const result = await this.bookingService.cancelBooking(bookingId);
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('cart')
  @Render('booking/cart')
  async cart(@Request() req) {
    const result = await this.bookingService.getBookingByUser(req.user.sub);

    const bookings = result.bookings ?? [];

    if (bookings.length > 0) {
    }

    if (!bookings.length) {
      return {
        bookings: [],
        concertTitle: '',
        subtotal: 0,
        serviceFees: 0,
        total: 0,
        quantity: 0,
      };
    }

    const concertTitle = bookings[0]?.concertId?.title || 'Concert';
    const subtotal = bookings.reduce(
      (sum, booking) => sum + (booking.amount || 0),
      0,
    );
    const serviceFees =
      bookings.reduce((sum, booking) => sum + (booking.quantity || 0), 0) * 1.0;
    const total = subtotal + serviceFees;
    const quantity = bookings.reduce(
      (sum, booking) => sum + (booking.quantity || 0),
      0,
    );

    console.log({
      bookingsCount: bookings.length,
      concertTitle,
      subtotal,
      serviceFees,
      total,
      quantity,
    });

    return {
      bookings,
      concertTitle,
      subtotal,
      serviceFees,
      total,
      quantity,
    };
  }

  @UseGuards(AuthGuard)
  @Get('checkout')
  @Render('booking/checkout')
  async checkout(@Request() req) {
    const result = await this.bookingService.getBookingByUser(req.user.sub);

    if (!result.bookings) {
      return { error: 'Aucune réservation trouvée' };
    }

    const bookings = result.bookings;
    const subtotal = bookings.reduce((sum, booking) => sum + booking.amount, 0);
    const serviceFees =
      bookings.reduce((sum, booking) => sum + booking.quantity, 0) * 1.0;
    const total = subtotal + serviceFees;
    const quantity = bookings.reduce(
      (sum, booking) => sum + booking.quantity,
      0,
    );

    return {
      bookings,
      subtotal,
      serviceFees,
      total,
      quantity,
      user: req.user,
    };
  }

  @UseGuards(AuthGuard)
  @Get('success')
  @Render('booking/success')
  async success(@Request() req) {
    const result = await this.bookingService.getBookingByUser(req.user.sub);

    const bookings = result.bookings;
    const subtotal = bookings.reduce((sum, booking) => sum + booking.amount, 0);
    const serviceFees =
      bookings.reduce((sum, booking) => sum + booking.quantity, 0) * 1.0;
    const total = subtotal + serviceFees;
    const quantity = bookings.reduce(
      (sum, booking) => sum + booking.quantity,
      0,
    );

    return {
      bookings,
      subtotal,
      serviceFees,
      total,
      quantity,
      user: req.user,
    };
  }

  @UseGuards(AuthGuard)
  @Get('history')
  @Render('booking/history')
  async history(@Request() req) {
    const result = await this.bookingService.getBookingByUser(req.user.sub);

    const bookings = result.bookings;
    const subtotal = bookings.reduce((sum, booking) => sum + booking.amount, 0);
    const serviceFees =
      bookings.reduce((sum, booking) => sum + booking.quantity, 0) * 1.0;
    const total = subtotal + serviceFees;
    const quantity = bookings.reduce(
      (sum, booking) => sum + booking.quantity,
      0,
    );

    return {
      bookings,
      subtotal,
      serviceFees,
      total,
      quantity,
      user: req.user,
    };
  }
}
