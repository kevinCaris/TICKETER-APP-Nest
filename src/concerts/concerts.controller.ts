import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { Concert } from './concert.schema';
import { CreateConcertDto } from './dto/create-concert.dto';
import { GroupService } from '../groups/groups.service';

import { UpdateConcertDto } from './dto/update-concert.dto';

@Controller('concerts')
export class ConcertsController {
  constructor(
    private readonly concertsService: ConcertsService,
    private readonly groupService: GroupService,
  ) {}

  // @UseGuards(AdminGuard)
  @Post()
  async create(@Body() concertData: CreateConcertDto): Promise<Concert> {
    return await this.concertsService.create(concertData);
  }
  @Get('view')
  async getConcertsView(
    @Res() res: any,
    @Query('genre') genre?: string,
    @Query('date') date?: string,
    @Query('group') group?: string,
  ) {
    let concerts;
    if (genre || date || group) {
      concerts = await this.concertsService.findWithFilters({
        genre,
        date,
        group,
      });
    } else {
      concerts = await this.concertsService.findAll();
    }

    // Récupérer les genres uniques
    const genres = await this.concertsService.getUniqueGenres();

    // Convertir les documents Mongoose en objets JavaScript simples
    const concertsData = concerts.map((c) => c.toObject());

    return res.render('user/concerts', {
      title: 'Concerts - TICKETER',
      concerts: concertsData,
      genres: genres,
      selectedGenre: genre || '',
    });
  }

  @Get('all')
  async all(
    @Res() res: any,
    @Query('genre') genre?: string,
    @Query('date') date?: string,
    @Query('group') group?: string,
  ) {
    let concerts;
    if (genre || date || group) {
      concerts = await this.concertsService.findWithFilters({
        genre,
        date,
        group,
      });
    } else {
      concerts = await this.concertsService.findAll();
    }

    const genres = await this.concertsService.getUniqueGenres();

    const concertsData = concerts.map((c) => c.toObject());

    return res.render('user/concerts', {
      title: 'Concerts - TICKETER',
      concerts: concertsData,
      genres: genres,
      selectedGenre: genre || '',
    });
  }
  @Get('view/:id')
  async getConcertDetailView(@Res() res: any, @Param('id') id: string) {
    const concert = await this.concertsService.findOne(id);

    if (!concert) {
      return res.status(404).render('error', {
        title: 'Concert not found',
        message: 'The concert you are looking for does not exist.',
      });
    }

    return res.render('user/concertDetails', {
      title: concert.title,
      concert: concert.toObject(),
    });
  }

  // @UseGuards(AdminGuard)
  @Get('admin')
  @Get('all')
  async getAdminConcertsView(
    @Res() res: any,
    @Query('genre') genre?: string,
    @Query('status') status?: string,
  ) {
    let concerts;

    const filters: any = {};
    if (genre) filters.genre = genre;
    if (status !== undefined) filters.status = status === 'true';

    if (Object.keys(filters).length > 0) {
      concerts = await this.concertsService.findWithFilters(filters);
    } else {
      concerts = await this.concertsService.findAll();
    }

    const genres = await this.concertsService.getUniqueGenres();
    const concertsData = concerts.map((c) => c.toObject());

    return res.render('admin/concerts', {
      layout: 'admin',
      title: 'Concert Management',
      concerts: concertsData,
      genres: genres,
      isConcerts: true,
    });
  }
  @Get()
  async findAll(
    @Query('genre') genre?: string,
    @Query('date') date?: string,
    @Query('group') group?: string,
  ): Promise<Concert[]> {
    if (genre || date || group) {
      return await this.concertsService.findWithFilters({ genre, date, group });
    }
    return await this.concertsService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Concert | null> {
    return await this.concertsService.findOne(id);
  }
  // @UseGuards(AdminGuard)

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateConcertDto,
  ): Promise<Concert | null> {
    return await this.concertsService.update(id, updateData);
  }
  // @UseGuards(AdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Concert | null> {
    return await this.concertsService.delete(id);
  }

  // c'eest à partir d'ici que j'ai tout mes chemin admin
  // @UseGuards(AdminGuard)
  @Get('admin/manage')
  async getConcertsManageView(@Res() res: any) {
    const concerts = await this.concertsService.findAll();
    const groups = await this.groupService.findAll();

    const concertsData = concerts.map((c) => c.toObject());

    const groupsData = groups.map((g: any) => ({
      id: g._id.toString(),
      name: g.name,
      genre: g.genre,
      description: g.description,
      image: g.image,
    }));

    return res.render('admin/concerts-manage', {
      layout: 'admin',
      title: 'Gestion des concerts',
      concerts: concertsData,
      groups: groupsData,
      isConcertsManage: true,
    });
  }
  //   // @UseGuards(AdminGuard)
  //   @Get('admin/create')
  //   async getCreateConcertView(@Res() res: any) {
  //     return res.render('admin/concert-create', {
  //       layout: 'admin',
  //       title: 'Créer un concert',
  //     });
  // }

  //   // @UseGuards(AdminGuard)
  //   @Get('admin/edit/:id')
  //   async getEditConcertView(@Res() res: any, @Param('id') id: string) {
  //     const concert = await this.concertsService.findOne(id);
  //   if (!concert) {
  //     return res.status(404).render('error', { title: 'Not found', message: 'Concert introuvable' });
  //   }
  //   return res.render('admin/concert-edit', {
  //     layout: 'admin',
  //     title: 'Modifier un concert',
  //     concert: concert.toObject(),
  //     });
  // }
}
