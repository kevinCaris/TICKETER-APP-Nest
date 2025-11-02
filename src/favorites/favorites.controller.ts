import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get('my-favorites')
  async getMyFavoritesPage(@Req() req: any, @Res() res: any) {
    const userId = req.user?.id || req.user?.sub;

    if (!userId) {
      return res.redirect('/login');
    }

    const favorites = await this.favoritesService.getUserFavorites(userId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res.render('user/my-favorites', {
      title: 'My Favorites',
      favorites: favorites,
      user: req.user,
    });
  }

  @Post(':groupId')
  async addFavorite(@Req() req: any, @Param('groupId') groupId: string) {
    console.log('🔍 req.user:', req.user); // Debug

    const userId = req.user?.id || req.user?.sub; // Essaie les deux

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const favorite = await this.favoritesService.addFavorite(userId, groupId);
    return {
      message: 'Group added to favorites',
      favorite: favorite,
    };
  }

  @Delete(':groupId')
  async removeFavorite(@Req() req: any, @Param('groupId') groupId: string) {
    const userId = req.user?.id || req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    await this.favoritesService.removeFavorite(userId, groupId);
    return {
      message: 'Group removed from favorites',
    };
  }

  @Get()
  async getUserFavorites(@Req() req: any) {
    const userId = req.user?.id || req.user?.sub;
    const favorites = await this.favoritesService.getUserFavorites(userId);
    return favorites;
  }

  @Get('check/:groupId')
  async checkFavorite(@Req() req: any, @Param('groupId') groupId: string) {
    const userId = req.user?.id || req.user?.sub;
    const isFavorite = await this.favoritesService.isGroupFavorite(userId, groupId);
    return { isFavorite };
  }
}