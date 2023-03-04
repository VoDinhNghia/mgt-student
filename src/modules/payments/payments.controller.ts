import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseRequest } from 'src/utils/responseApi';
import { CreateMoneyPerCreditMgtDto } from './dtos/mgt-money-per-credit.create.dto';
import { PaymentsService } from './payments.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role-auth.guard';
import { roleTypeAccessApi } from 'src/constants/constant';
import { UpdateMoneyPerCreditMgtDto } from './dtos/mgt-money-per-credit.update.dto';

@Controller('api/payments')
@ApiTags('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentsService) {}

  @Post('/amount-credit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async createMoneyPerCreditMgt(
    @Body() createCreditmgtDto: CreateMoneyPerCreditMgtDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.createMoneyPerCreditMgt(
      createCreditmgtDto,
    );
    return new ResponseRequest(res, result, 'Create amount credit success.');
  }

  @Put('/amount-credit/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(roleTypeAccessApi.ADMIN))
  async updateMoneyPerCreditMgt(
    @Param('id') id: string,
    @Body() updateCreditmgtDto: UpdateMoneyPerCreditMgtDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.updateMoneyPerCreditMgt(
      id,
      updateCreditmgtDto,
    );
    return new ResponseRequest(res, result, 'Update amount credit success.');
  }

  @Get('/amount-credit')
  async getAllMoneyPerCreditMgt(
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.findAllMoneyPerCreditMgt();
    return new ResponseRequest(res, result, 'Get amount credit success.');
  }

  @Get('/amount-credit/:id')
  async getByIdMoneyPerCreditMgt(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.paymentService.findByIdMoneyPerCreditMgt(id);
    return new ResponseRequest(res, result, 'Get amount credit success.');
  }
}
