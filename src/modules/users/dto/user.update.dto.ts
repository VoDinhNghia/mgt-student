import { ApiProperty } from '@nestjs/swagger';

export class UsersUpdateDto  {
    @ApiProperty()
    id?: string;
   
    @ApiProperty()
    email?: string;

    @ApiProperty()
    role?: string;

    @ApiProperty()
    status?: string;
}