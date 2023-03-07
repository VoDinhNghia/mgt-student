import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { StorageObjectDto } from '../users/dto/user.file-upload.dto';
import { AttachmentsService } from './attachments.service';
import { Request, Response } from 'express';
import { ResponseRequest } from 'src/utils/response-api';
import {
  destinationAttachment,
  fileName,
  imageFileFilter,
} from 'src/validates/validate.attachment.upload-file';
@Controller('api/attachments')
@ApiTags('attachments')
export class AttachmentsController {
  constructor(private readonly attachmentService: AttachmentsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(
    RoleGuard([
      ErolesUser.ADMIN,
      ErolesUser.ACCOUNTANT,
      ErolesUser.LECTURER,
      ErolesUser.STUDENT,
      ErolesUser.LIBRARIAN,
      ErolesUser.STAFF,
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFileFilter,
      storage: diskStorage({
        destination: destinationAttachment,
        filename: fileName,
      }),
    }),
  )
  async createAttachment(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: StorageObjectDto,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    const uploadBy: string = user.profileId;
    const result = await this.attachmentService.createAttachment(
      file,
      uploadBy,
    );
    return new ResponseRequest(res, result, `Create attachment success.`);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(
    RoleGuard([
      ErolesUser.ADMIN,
      ErolesUser.ACCOUNTANT,
      ErolesUser.LECTURER,
      ErolesUser.STUDENT,
      ErolesUser.LIBRARIAN,
      ErolesUser.STAFF,
    ]),
  )
  async deleteAttachment(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const { user }: Request | Record<string, any> = req;
    await this.attachmentService.deleteAttachment(id, user.profileId);
    return new ResponseRequest(res, true, `Delete attachment success.`);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(
    RoleGuard([
      ErolesUser.ADMIN,
      ErolesUser.ACCOUNTANT,
      ErolesUser.LECTURER,
      ErolesUser.STUDENT,
      ErolesUser.LIBRARIAN,
      ErolesUser.STAFF,
    ]),
  )
  async getAttachmentById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.attachmentService.getAttachmentById(id);
    return new ResponseRequest(res, result, `Get attachment success.`);
  }
}
