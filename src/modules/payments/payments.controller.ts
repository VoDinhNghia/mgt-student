import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { PaymentsService } from './payments.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { ErolesUser } from 'src/constants/constant';
import { QueryTuitionUser } from './dtos/payments.query.tuition-user.dto';
import { CreateUserPaymentDto } from './dtos/payments.users.create.dto';
import { paymentMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { paymentController } from 'src/constants/constants.controller.name-tag';

@Controller(paymentController.name)
@ApiTags(paymentController.tag)
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Get('/user-tuition/')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ACCOUNTANT, ErolesUser.STUDENT]))
  public async getTuitionUserInSemester(
    @Query() queryDto: QueryTuitionUser,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.findTuitionUserInSemester(
      queryDto,
    );

    return new ResponseRequest(res, result, paymentMsg.getAllUserTuition);
  }

  @Post('/user-tuition')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ACCOUNTANT]))
  public async createUserPayment(
    @Body() userPaymentDto: CreateUserPaymentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const { profileId } = user;
    const result = await this.paymentService.createUserPayment(
      userPaymentDto,
      profileId,
    );

    return new ResponseRequest(res, result, paymentMsg.createUserTuition);
  }
}
