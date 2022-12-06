import { ApiProperty } from '@nestjs/swagger';

export class loginResponse {
  @ApiProperty()
  access_token: string;
}
