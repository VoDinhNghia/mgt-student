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
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { StorageObjectDto } from '../users/dto/users.file-upload.dto';
import { AttachmentsService } from './attachments.service';
import { Request, Response } from 'express';
import { ResponseRequest } from 'src/utils/utils.response-api';
import {
  destinationAttachment,
  fileName,
  imageFileFilter,
} from 'src/validates/validates.attachment.upload-file';
import { attachmentMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { attachmentController } from 'src/constants/constants.controller.name-tag';
@Controller(attachmentController.name)
@ApiTags(attachmentController.tag)
export class AttachmentsController {
  constructor(private readonly attachmentService: AttachmentsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.attachmentService.createAttachment(
      file,
      profileId,
    );
    return new ResponseRequest(res, result, attachmentMsg.create);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteAttachment(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    await this.attachmentService.deleteAttachment(id, user.profileId);
    return new ResponseRequest(res, true, attachmentMsg.delete);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAttachmentById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.attachmentService.getAttachmentById(id);
    return new ResponseRequest(res, result, attachmentMsg.getById);
  }
}
