import { ApiProperty } from '@nestjs/swagger';

// interface 나 type은 오류난다.
export abstract class findUser {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  image: string;
}
export abstract class findUsers extends findUser {
  @ApiProperty()
  phone_number: string;
}
