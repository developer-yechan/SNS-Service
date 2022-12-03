import { ApiProperty } from '@nestjs/swagger';

export class unAuthorized {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}

export class commonError extends unAuthorized {
  @ApiProperty()
  error: string;
}
