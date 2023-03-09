import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseRequest } from 'src/utils/response-api';
import { CreateMoneyPerCreditMgtDto } from './dtos/mgt-money-per-credit.create.dto';
import { PaymentsService } from './payments.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role-auth.guard';
import { ErolesUser } from 'src/constants/constant';
import { UpdateMoneyPerCreditMgtDto } from './dtos/mgt-money-per-credit.update.dto';
import { QueryTuitionUser } from './dtos/query.tuition-user.dto';
import { CreateUserPaymentDto } from './dtos/user.payments.create.dto';

@Controller('api/payments')
@ApiTags('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Post('/mgt-money-per-credit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createMoneyPerCreditMgt(
    @Body() createCreditmgtDto: CreateMoneyPerCreditMgtDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.createMoneyPerCreditMgt(
      createCreditmgtDto,
    );
    return new ResponseRequest(res, result, 'Create amount credit success.');
  }

  @Put('/mgt-money-per-credit/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateMoneyPerCreditMgt(
    @Param('id') id: string,
    @Body() updateCreditmgtDto: UpdateMoneyPerCreditMgtDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.updateMoneyPerCreditMgt(
      id,
      updateCreditmgtDto,
    );
    return new ResponseRequest(res, result, 'Update mgt money credit success.');
  }

  @Get('/mgt-money-per-credit')
  async getAllMoneyPerCreditMgt(
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.findAllMoneyPerCreditMgt();
    return new ResponseRequest(res, result, 'Get mgt money credit success.');
  }

  @Get('/mgt-money-per-credit/:id')
  async getByIdMoneyPerCreditMgt(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.findByIdMoneyPerCreditMgt(id);
    return new ResponseRequest(res, result, 'Get mgt money credit success.');
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
    return new ResponseRequest(res, result, 'Get tuition of user success.');
  }

  @Post('/user-tuition')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.ACCOUNTANT]))
  async createUserPayment(
    @Body() userPaymentDto: CreateUserPaymentDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.createUserPayment(userPaymentDto);
    return new ResponseRequest(res, result, 'Create user payment success.');
  }
}
