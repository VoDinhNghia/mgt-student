import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
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
import { ResponseRequest } from 'src/abstracts/responseApi';

@Controller('news')
@ApiTags('news')
export class NewsController {
  constructor(private readonly newService: NewsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async createNews(
    @Body() createNewDto: CreateNewDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.newService.createNews(createNewDto);
    return new ResponseRequest(res, result, 'Create news success');
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async getById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.newService.findNewById(id);
    return new ResponseRequest(res, result, 'Get news by id success');
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async updateNews(
    @Param('id') id: string,
    @Body() updateNewDto: UpdateNewDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.newService.updateNews(id, updateNewDto);
    return new ResponseRequest(res, result, 'Update news success');
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async getListNews(
    @Query() queryNewDto: QueryNewDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.newService.getLists(queryNewDto);
    return new ResponseRequest(res, result, 'Get news list success');
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async deleteNews(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    await this.newService.deleteNews(id);
    return new ResponseRequest(res, true, 'Delete news success');
  }
}
