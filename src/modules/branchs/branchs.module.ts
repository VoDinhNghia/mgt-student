import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchController } from './branchs.controller';
import { BranchService } from './branchs.service';
import { Branch, BranchSchema } from './schemas/branchs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Branch.name, schema: BranchSchema }]),
  ],
  providers: [BranchService],
  controllers: [BranchController],
})
export class BranchModule {}
