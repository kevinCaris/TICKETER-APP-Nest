import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  UseGuards,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupService } from './groups.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupService) {}

  @Get('admin')
  @Render('admin/admin-groups')
  async getAdminGroup() {
    const groups = await this.groupsService.findAll();
    const plainGroups = groups.map((g: any) => ({
      id: g._id.toString(),
      name: g.name,
      genre: g.genre,
      description: g.description,
      image: g.image,
    }));

    return {
      title: 'Singers',
      data: plainGroups,
      layout: 'admin',
      currentPage: 'groups',
    };
  }

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get('singles')
  @Render('user/singers')
  async getSinglesPage() {
    const groups = await this.groupsService.findAll();

    const plainGroups = groups.map((g: any) => ({
      id: g._id.toString(),
      name: g.name,
      genre: g.genre,
      description: g.description,
      image: g.image,
    }));

    return {
      title: 'Singers',
      data: plainGroups,
    };
  }

  @Get()
  findAll() {
    const data = this.groupsService.findAll();
    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }
  // @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: CreateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.groupsService.remove(id);
    return {
      success: true,
      message: 'Group supriméavec succès',
    };
  }
}
