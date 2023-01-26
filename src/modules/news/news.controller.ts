import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { CreateNewDto } from './dtos/news.create.dto';
import { NewsService } from './news.service';

@Controller('news')
@ApiTags('news')
export class NewsController {
  constructor(private readonly newService: NewsService) {}

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async create(@Body() createNewDto: CreateNewDto) {
    console.log('hdhhd', createNewDto);
    return 0;
  }
}
