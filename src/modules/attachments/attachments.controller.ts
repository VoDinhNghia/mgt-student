import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { roleTypeAccessApi } from 'src/commons/constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { StorageObjectDto } from '../users/dto/user.file-upload.dto';
import { AttachmentsService } from './attachments.service';
import { Request, Response } from 'express';
import { existsSync, mkdirSync } from 'fs';
@Controller('attachments')
@ApiTags('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentService: AttachmentsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './src/public/attachments',
      }),
    }),
  )
  async createAttachment(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: StorageObjectDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    const { user }: Request | Record<string, any> = req;
    const uploadBy: string = user.userId;
    const result = await this.attachmentService.createAttachment(
      file,
      uploadBy,
    );
    res.status(HttpStatus.OK).json({
      statusCode: 200,
      data: result,
      message: 'Create attachment success.',
    });
  }

  @Get('/:imgpath')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  seeUploadedFile(@Param('imgpath') image: string, @Res() res: Response) {
    return res.sendFile(image, { root: './src/public/attachments' });
  }
}
