import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { roleTypeAccessApi } from 'src/constants/constant';
import { ResponseRequest } from 'src/utils/responseApi';

@Controller('api/blogs')
@ApiTags('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async createBlog(@Res() res: Response): Promise<ResponseRequest> {
    return new ResponseRequest(res, 'OK', `Create blog success.`);
  }
}
