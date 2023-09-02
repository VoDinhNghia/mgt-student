import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { CreateNewDto } from './dtos/news.create.dto';
import { NewsService } from './news.service';
import { Response, Request } from 'express';
import { UpdateNewDto } from './dtos/news.update.dto';
import { QueryNewDto } from './dtos/news.query.dto';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { newsMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { newController } from 'src/constants/constants.controller.name-tag';

@Controller(newController.name)
@ApiTags(newController.tag)
export class NewsController {
  constructor(private readonly newService: NewsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createNews(
    @Body() createNewDto: CreateNewDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.newService.createNews(createNewDto, profileId);

    return new ResponseRequest(res, result, newsMsg.create);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async getById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.newService.findNewsById(id);

    return new ResponseRequest(res, result, newsMsg.getById);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateNews(
    @Param('id') id: string,
    @Body() updateNewDto: UpdateNewDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.newService.updateNews(
      id,
      updateNewDto,
      profileId,
    );

    return new ResponseRequest(res, result, newsMsg.update);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async getListNews(
    @Query() queryNewDto: QueryNewDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.newService.findAllNews(queryNewDto);

    return new ResponseRequest(res, result, newsMsg.getAll);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteNews(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.newService.deleteNews(id, profileId);

    return new ResponseRequest(res, true, newsMsg.delete);
  }
}
