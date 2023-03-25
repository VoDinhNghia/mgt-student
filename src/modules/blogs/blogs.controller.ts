import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogsService } from './blogs.service';

@Controller('api/blogs')
@ApiTags('blogs')
export class BlogsController {
  constructor(private readonly blogService: BlogsService) {}
}
