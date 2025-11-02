import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  email: string;
}

@Injectable()
export class AuthService {
  private readonly jwtSecret =
    process.env.JWT_SECRET || 'default-secret-change-this';

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * register user
   * @param email
   * @param password
   * @param username
   * @returns
   */
  async register(email: string, password: string, username: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailVerificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    const user = new this.userModel({
      email,
      password: hashedPassword,
      username,
      isAdmin: false,
      isEmailVerified: false,
      emailVerificationToken,
      emailVerificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verificationLink = `${process.env.APP_URL}/verify-email?token=${emailVerificationToken}`;

    try {
      await this.mailService.send({
        to: email,
        subject: 'Vérifiez votre email TICKETER',
        template: 'emailVerification',
        data: {
          username,
          verificationLink,
        },
      });

      await user.save();

      return {
        success: true,
        message: 'User registered successfully. Please verify your email.',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Registration failed: unable to send verification email. Please try again later.',
      );
    }
  }

  /**
   * Vérifier l'email avec le token
   * @param token
   * @returns
   */

  async verifyEmail(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      // Cast en JwtPayload
      const payload = decoded as JwtPayload;

      // Trouver l'utilisateur
      const user = await this.userModel.findOne({
        email: payload.email,
        emailVerificationToken: token,
      });

      if (!user) {
        throw new BadRequestException('Token invalide ou expiré');
      }

      // Vérifier que le token n'a pas expiré
      if (
        user.emailVerificationTokenExpires &&
        user.emailVerificationTokenExpires < new Date()
      ) {
        throw new BadRequestException('Le token a expiré');
      }

      //Marquer l'email comme vérifié
      user.isEmailVerified = true;
      user.emailVerificationToken = null;
      user.emailVerificationTokenExpires = null;
      await user.save();

      return {
        success: true,
        message:
          'Email vérifié avec succès! Vous pouvez maintenant vous connecter.',
      };
    } catch (error) {
      throw new BadRequestException('Erreur lors de la vérification: ');
    }
  }

  /**
   * Login user
   * @param email
   * @param password
   * @returns
   */

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (!user.isEmailVerified) {
      throw new BadRequestException(
        "Votre email n'est pas encore vérifié. Vérifiez votre boîte mail.",
      );
    }

    const token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    });

    return {
      success: true,
      message: 'Login successful',
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin,
      },
    };
  }

  /**
   * Renvoyer le mail
   * @param email
   * @returns
   */
  async resendVerificationEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Cet email est déjà vérifié');
    }

    // Générer un nouveau token
    const emailVerificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' },
    );

    // Mettre à jour l'utilisateur
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationTokenExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );
    await user.save();

    // Envoyer l'email
    const verificationLink = `${process.env.APP_URL}/verify-email?token=${emailVerificationToken}`;

    await this.mailService.send({
      to: email,
      subject: 'Vérifiez votre email TICKETER (Renvoi)',
      template: 'emailVerification',
      data: {
        username: user.username,
        verificationLink: verificationLink,
      },
    });

    return {
      success: true,
      message: 'Email de vérification renvoyé! Vérifiez votre boîte mail.',
    };
  }
}