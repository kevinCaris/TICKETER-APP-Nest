import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  ValidationPipe,
  Render,
  Res,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { NoAuthGuard } from './auth.guard';
import { JwtUser } from './interfaces/jwt-user.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ConcertsService } from 'src/concerts/concerts.service';
import { GroupService } from 'src/groups/groups.service';
import type { Response, Request as ExpressRequest } from 'express';
import { AuthAdminGuard } from './auth-admin.guard';

interface AuthenticatedRequest extends ExpressRequest {
  user?: JwtUser;
}

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly concertsService: ConcertsService,
    private readonly groupsService: GroupService,
  ) {}

  @Get('login')
  @Render('auth/login')
  loginView() {
    return {};
  }

  @Get('register')
  @Render('auth/register')
  registerView() {
    return {};
  }

  @Get('/')
  @Render('index')
  getHomePage() {
    return { title: 'Accueil - TICKETER' };
  }

  @Get('login')
  @UseGuards(NoAuthGuard)
  @Render('auth/login')
  getLoginPage() {
    return { title: 'Login - TICKETER' };
  }

  @Get('register')
  @UseGuards(NoAuthGuard)
  @Render('auth/register')
  getRegisterPage() {
    return { title: 'Register - TICKETER' };
  }
  @UseGuards(AuthAdminGuard)
  @UseGuards(AuthGuard)
  @Get('admin')
  @Render('admin/admin')
  getUserDashboard() {
    return {
      title: 'Mon Compte - TICKETER',
      layout: 'admin',
      currentPage: 'dashboard',
    };
  }

  @Get('verify-email')
  @Render('auth/verify-email')
  getVerifyEmailPage(@Query('token') token: string) {
    return {
      title: 'Vérification Email - TICKETER',
      token: token,
    };
  }

  @Post('register')
  async register(
    @Body(new ValidationPipe()) registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.authService.register(
        registerDto.email,
        registerDto.password,
        registerDto.username,
      );

      return {
        success: true,
        message: 'Inscription réussie! Vérifiez votre email.',
        data: result,
      };
    } catch (error) {
      res.status(400);
      return {
        success: false,
        message: error.message || "Erreur d'enregistrement",
      };
    }
  }

  @Post('verify-email')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.authService.verifyEmail(verifyEmailDto.token);

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      res.status(400);
      return {
        success: false,
        message: error.message || 'Erreur lors de la vérification',
      };
    }
  }

  @Post('login')
  async login(
    @Body(new ValidationPipe()) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.authService.login(
        loginDto.email,
        loginDto.password,
      );

      res.cookie('access_token', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24h
      });

      return {
        success: true,
        message: 'Connexion réussie',
        access_token: result.access_token,
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          isAdmin: result.user.isAdmin,
        },
      };
    } catch (error) {
      res.status(401);
      return {
        success: false,
        message: error.message || 'Erreur de connexion',
      };
    }
  }

  @Post('logout')
  logoutApi(
    @Request() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return {
      success: true,
      message: 'Déconnexion réussie',
    };
  }

  // INfo de l' utilisateur connecté
  @Get('profile')
  @UseGuards(AuthGuard)
  @Render('user/profile')
  getMePage(@Request() req: AuthenticatedRequest) {
    return {
      title: 'Mes Informations',
      user: req.user,
    };
  }

  @Get('auth/check')
  @UseGuards(AuthGuard)
  checkAuth(@Request() req: AuthenticatedRequest) {
    return {
      success: true,
      isAuthenticated: true,
      user: req.user,
    };
  }

  // @Get('/')
  // @Render('index')
  // async getHome() {

  //   const groups = await this.groupsService.findAll();
  //   console.log(groups)
  //   const concerts = await this.concertsService.findAll();
  //   console.log(concerts)

  //   const upcomingConcerts = concerts
  //     .filter(concert => new Date(concert.date) >= new Date())
  //     .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  //     .slice(0, 5)
  //     .map(c => c.toObject());

  //   // Concerts urgents (moins de 10 places disponibles)
  //   const urgentConcerts = concerts
  //     .filter(concert => concert.availableSeats <= 10 && concert.availableSeats > 0)
  //     .sort((a, b) => a.availableSeats - b.availableSeats)
  //     .slice(0, 5)
  //     .map(c => c.toObject());

  //   // Genres
  //   const genres = await this.concertsService.getUniqueGenres();

  //   // console.log({
  //   //   title: 'TICKETER - Réservez vos billets de concert',
  //   //   upcomingConcerts,
  //   //   urgentConcerts,
  //   //   groups,
  //   //   genres,
  //   //   concerts
  //   // })

  //   return {
  //     title: 'TICKETER - Réservez vos billets de concert',
  //     upcomingConcerts,
  //     urgentConcerts,
  //     groups,
  //     genres,
  //     concerts
  //   }
  // }
}
