import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Countries,
  CountriesSchema,
} from '../countries/schemas/countries.schema';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { Branch, BranchSchema } from './schemas/branch.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Branch.name, schema: BranchSchema },
      { name: Countries.name, schema: CountriesSchema },
    ]),
  ],
  providers: [BranchService],
  controllers: [BranchController],
})
export class BranchModule {}
