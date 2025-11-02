import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  Patch,
  Req,
  HttpException,
  HttpStatus,
  Render,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-user.dto';
import { AuthAdminGuard } from 'src/auth/auth-admin.guard';
import { use } from 'passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('accounts')
  @Render('admin/accounts')
  async accountsView() {
    const users = await this.usersService.findAll();
    console.log(users);

    const sortedUsers = users.sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    const plainUsers = sortedUsers.map((g: any) => ({
      id: g._id.toString(),
      name: g.username,
      email: g.email,
      isAdmin: g.isAdmin,
      createAt: g.createdAt?.toLocaleDateString?.() ?? '',
    }));

    return {
      title: 'Gestion des comptes',
      data: plainUsers,
      layout: 'admin',
      currentPage: 'users',
    };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOneById(id);
  }

  @Patch(':id')
  async patchUser(
    @Param('id') id: string,
    @Body() updateData: UpdateProfileDto,
  ) {
    const user = await this.usersService.update(id, updateData);
    if (!user) {
      throw new HttpException('Utilisateur introuvable', HttpStatus.NOT_FOUND);
    }
    return { message: 'Utilisateur mis à jour avec succès', user };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { message: 'Utilisateur supprimé avec succès' };
  }

  @Patch(':id/promote')
  async promoteUser(@Param('id') id: string) {
    const user = await this.usersService.updateRole(id, true);
    if (!user) {
      throw new HttpException('Utilisateur introuvable', HttpStatus.NOT_FOUND);
    }
    return { message: 'Utilisateur promu en administrateur', user };
  }

  @Patch(':id/demote')
  async demoteUser(@Param('id') id: string) {
    const user = await this.usersService.updateRole(id, false);
    if (!user) {
      throw new HttpException('Utilisateur introuvable', HttpStatus.NOT_FOUND);
    }
    return { message: 'Utilisateur rétrogradé en simple utilisateur', user };
  }
}
