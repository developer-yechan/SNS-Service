import { ApiProperty } from '@nestjs/swagger';

export abstract class unAuthorized {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;
}

export abstract class badRequest extends unAuthorized {
  @ApiProperty()
  error: string;
}
