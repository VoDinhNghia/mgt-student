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
import { ResponseRequest } from 'src/utils/response-api';
import { CreateMoneyPerCreditMgtDto } from './dtos/mgt-money-per-credit.create.dto';
import { PaymentsService } from './payments.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role-auth.guard';
import { ErolesUser } from 'src/constants/constant';
import { UpdateMoneyPerCreditMgtDto } from './dtos/mgt-money-per-credit.update.dto';
import { QueryTuitionUser } from './dtos/query.tuition-user.dto';
import { CreateUserPaymentDto } from './dtos/user.payments.create.dto';
import { msgResponse } from 'src/constants/message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';

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
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.paymentService.createMoneyPerCreditMgt(
      createCreditmgtDto,
      createdBy,
    );
    return new ResponseRequest(res, result, msgResponse.createMoneyCreditMgt);
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
    return new ResponseRequest(res, result, msgResponse.updateMoneyCreditMgt);
  }

  @Get('/mgt-money-per-credit')
  async getAllMoneyPerCreditMgt(
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.findAllMoneyPerCreditMgt();
    return new ResponseRequest(res, result, msgResponse.getAllMoneyCreditMgt);
  }

  @Get('/mgt-money-per-credit/:id')
  async getByIdMoneyPerCreditMgt(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.findByIdMoneyPerCreditMgt(id);
    return new ResponseRequest(res, result, msgResponse.getByIdMoneyCreditMgt);
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
    return new ResponseRequest(res, result, msgResponse.getAllUserTuition);
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
    return new ResponseRequest(res, result, msgResponse.createUserTuition);
  }
}
