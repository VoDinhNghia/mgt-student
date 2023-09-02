import {
  Body,
  Controller,
  Post,
  Res,
  Param,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Put,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { TrainningPointService } from './trainning-point.service';
import { trainningPointController } from 'src/constants/constants.controller.name-tag';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { ErolesUser } from 'src/constants/constant';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  csvFileFilter,
  destinationImportVoluntee,
  fileName,
} from 'src/validates/validates.attachment.upload-file';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { StorageObjectDto } from '../users/dto/users.file-upload.dto';
import { diskStorage } from 'multer';
import { Response, Request } from 'express';
import { readFileSync } from 'fs';
import { getDataFromCsvFileUpload } from 'src/utils/utils.get.data-from-csv-upload';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { trainningPointMsg } from 'src/constants/constants.message.response';
import { CreateTrainningPointDto } from './dtos/trainning-point.create.dto';
import { CreateVolunteeProgramDto } from './dtos/trainning-point.create.voluntee-program.dto';
import { UpdateTrainningPointDto } from './dtos/trainning-point.update.dto';
import { UpdateVolunteeDto } from './dtos/trainning-point.update-voluntee.dto';
import { QueryTrainningPointDto } from './dtos/trainning-point.query.dto';
import { QueryVolunteeDto } from './dtos/trainning-point.query-voluntee.dto';

@Controller(trainningPointController.name)
@ApiTags(trainningPointController.tag)
export class TrainningPointController {
  constructor(private readonly service: TrainningPointService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createTrainningPoint(
    @Body() createDto: CreateTrainningPointDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.createTrainingPoint(createDto, profileId);

    return new ResponseRequest(
      res,
      result,
      trainningPointMsg.createTrainningPoint,
    );
  }

  @Post('/voluntee')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async createVoluntee(
    @Body() createDto: CreateVolunteeProgramDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.createVoluntee(createDto, profileId);

    return new ResponseRequest(res, result, trainningPointMsg.createVoluntee);
  }

  @Post('/import-voluntee')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: csvFileFilter,
      storage: diskStorage({
        destination: destinationImportVoluntee,
        filename: fileName,
      }),
    }),
  )
  public async importVolunteeProgram(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: StorageObjectDto,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const rawData = readFileSync(file.path, 'utf8');
    const csvData = getDataFromCsvFileUpload(rawData);
    const result = await this.service.importVoluntee(csvData, profileId);

    return new ResponseRequest(
      res,
      result,
      trainningPointMsg.importVolunteeProgram,
    );
  }

  @Post('/import')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: csvFileFilter,
      storage: diskStorage({
        destination: destinationImportVoluntee,
        filename: fileName,
      }),
    }),
  )
  public async importTrainningPoint(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: StorageObjectDto,
    @UploadedFile('file') file: Express.Multer.File,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const rawData = readFileSync(file.path, 'utf8');
    const csvData = getDataFromCsvFileUpload(rawData);
    const result = await this.service.importTrainningPoint(csvData, profileId);

    return new ResponseRequest(
      res,
      result,
      trainningPointMsg.importTraingPoint,
    );
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateTrainningPoint(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateDto: UpdateTrainningPointDto,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.updateTrainningPoint(
      id,
      updateDto,
      profileId,
    );

    return new ResponseRequest(
      res,
      result,
      trainningPointMsg.updateTrainningPoint,
    );
  }

  @Put('/voluntee/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async updateVoluntee(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() updateDto: UpdateVolunteeDto,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.service.updateVolutee(id, updateDto, profileId);

    return new ResponseRequest(res, result, trainningPointMsg.updateVoluntee);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteTrainningPoint(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.service.deleteTrainningPoint(id, profileId);

    return new ResponseRequest(
      res,
      true,
      trainningPointMsg.deleteTrainningPoint,
    );
  }

  @Delete('/voluntee/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  public async deleteVoluntee(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    await this.service.deleteVoluntee(id, profileId);

    return new ResponseRequest(res, true, trainningPointMsg.deleteVoluntee);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async getAllTrainningPoints(
    @Res() res: Response,
    @Query() queryDto: QueryTrainningPointDto,
  ): Promise<ResponseRequest> {
    const results = await this.service.findAllTrainningPoint(queryDto);

    return new ResponseRequest(
      res,
      results,
      trainningPointMsg.getAllTrainningPoint,
    );
  }

  @Get('/voluntee')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async getAllVoluntee(
    @Res() res: Response,
    @Query() queryDto: QueryVolunteeDto,
  ): Promise<ResponseRequest> {
    const results = await this.service.findAllVolunteeProgram(queryDto);

    return new ResponseRequest(res, results, trainningPointMsg.getAllVoluntee);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async getTrainningPointById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findTrainningPointById(id);

    return new ResponseRequest(
      res,
      result,
      trainningPointMsg.getByIdTrainningPoint,
    );
  }

  @Get('/voluntee/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async getVolunteeById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findVolunteeById(id);

    return new ResponseRequest(res, result, trainningPointMsg.getByIdVoluntee);
  }
}
