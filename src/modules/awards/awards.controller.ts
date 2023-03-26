import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { AwardsService } from './awards.service';
import { Response, Request } from 'express';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { CreateAwardDto } from './dtos/awards.create.dto';
import { UpdateAwardDto } from './dtos/awards.update.dto';
import { QueryAwardDto } from './dtos/awards.query.dto';
import { msgResponse } from 'src/constants/message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';

@Controller('api/awards')
@ApiTags('awards')
export class AwardsController {
  constructor(private readonly awardService: AwardsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createAward(
    @Res() res: Response,
    @Body() createAwardDto: CreateAwardDto,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.awardService.createAward(
      createAwardDto,
      createdBy,
    );
    return new ResponseRequest(res, result, msgResponse.createAward);
  }

  @Get()
  async getAllAward(
    @Query() queryAwardDto: QueryAwardDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.awardService.findAllAward(queryAwardDto);
    return new ResponseRequest(res, result, msgResponse.getAllAward);
  }

  @Get('/:id')
  async getAwardById(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<ResponseRequest> {
    const result = await this.awardService.findAwardById(id);
    return new ResponseRequest(res, result, msgResponse.getByIdAward);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateAward(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateAwardDto: UpdateAwardDto,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    await this.awardService.updateAward(id, updateAwardDto, updatedBy);
    return new ResponseRequest(res, true, msgResponse.updateAward);
  }
}
