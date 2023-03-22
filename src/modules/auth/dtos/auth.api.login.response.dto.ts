import { ApiProperty } from '@nestjs/swagger';
import { UserLoginResponseDto } from './auth.result.login-service.dto';

export class ResponseLoginApiDto {
  @ApiProperty({ default: 200 })
  statusCode?: number;

  @ApiProperty({ type: UserLoginResponseDto })
  data: UserLoginResponseDto;

  @ApiProperty({ default: 'Success' })
  message: string;
}
