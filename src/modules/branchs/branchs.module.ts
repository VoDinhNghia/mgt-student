import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValidateField } from 'src/validates/validate.field-id.dto';
import { BranchController } from './branchs.controller';
import { BranchService } from './branchs.service';
import { Branch, BranchSchema } from './schemas/branchs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Branch.name, schema: BranchSchema }]),
  ],
  providers: [BranchService, ValidateField],
  controllers: [BranchController],
})
export class BranchModule {}
