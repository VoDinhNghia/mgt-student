import {
  Body,
  Controller,
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
import { ResponseRequest } from 'src/utils/utils.response-api';
import { CreateMoneyPerCreditMgtDto } from './dtos/payments.mgt-money-per-credit.create.dto';
import { PaymentsService } from './payments.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { ErolesUser } from 'src/constants/constant';
import { UpdateMoneyPerCreditMgtDto } from './dtos/payments.mgt-money-per-credit.update.dto';
import { QueryTuitionUser } from './dtos/payments.query.tuition-user.dto';
import { CreateUserPaymentDto } from './dtos/payments.users.create.dto';
import { paymentMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { paymentController } from 'src/constants/constants.controller.name-tag';
import { QueryMgtMoneyPerCreditDto } from './dtos/payments.query.mgt-money-per-credit.dto';

@Controller(paymentController.name)
@ApiTags(paymentController.tag)
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Post('/mgt-money-per-credit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createMoneyPerCreditMgt(
    @Body() createCreditmgtDto: CreateMoneyPerCreditMgtDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.paymentService.createMoneyPerCreditMgt(
      createCreditmgtDto,
      createdBy,
    );
    return new ResponseRequest(res, result, paymentMsg.createMoneyCreditMgt);
  }

  @Put('/mgt-money-per-credit/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateMoneyPerCreditMgt(
    @Param('id') id: string,
    @Body() updateCreditmgtDto: UpdateMoneyPerCreditMgtDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.paymentService.updateMoneyPerCreditMgt(
      id,
      updateCreditmgtDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, paymentMsg.updateMoneyCreditMgt);
  }

  @Get('/mgt-money-per-credit')
  async getAllMoneyPerCreditMgt(
    @Query() queryDto: QueryMgtMoneyPerCreditDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.findAllMoneyPerCreditMgt(queryDto);
    return new ResponseRequest(res, result, paymentMsg.getAllMoneyCreditMgt);
  }

  @Get('/mgt-money-per-credit/:id')
  async getByIdMoneyPerCreditMgt(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.findByIdMoneyPerCreditMgt(id);
    return new ResponseRequest(res, result, paymentMsg.getByIdMoneyCreditMgt);
  }

  @Get('/user-tuition/')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ACCOUNTANT, ErolesUser.STUDENT]))
  async getTuitionUserInSemester(
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
  async createUserPayment(
    @Body() userPaymentDto: CreateUserPaymentDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.paymentService.createUserPayment(
      userPaymentDto,
      createdBy,
    );
    return new ResponseRequest(res, result, paymentMsg.createUserTuition);
  }
}
