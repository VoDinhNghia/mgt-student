import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { CreateNewDto } from './dtos/news.create.dto';
import { NewsService } from './news.service';
import { Response } from 'express';
import { UpdateNewDto } from './dtos/news.update.dto';
import { QueryNewDto } from './dtos/news.query.dto';

@Controller('news')
@ApiTags('news')
export class NewsController {
  constructor(private readonly newService: NewsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async create(@Body() createNewDto: CreateNewDto, res: Response) {
    const result = await this.newService.createNew(createNewDto);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Create news success.',
    });
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async getById(@Param('id') id: string, res: Response) {
    const result = await this.newService.findNewById(id);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Get news by id success.',
    });
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async updateNew(
    @Param('id') id: string,
    @Body() updateNewDto: UpdateNewDto,
    res: Response,
  ) {
    const result = await this.newService.updateNew(id, updateNewDto);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Update news success.',
    });
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async getListNews(@Query() queryNewDto: QueryNewDto, res: Response) {
    const result = await this.newService.getLists(queryNewDto);
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Get news list success.',
    });
  }
}
