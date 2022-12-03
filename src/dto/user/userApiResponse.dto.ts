import { ApiProperty } from '@nestjs/swagger';

export class findUsers {
  @ApiProperty()
  id: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  image: string;
}

export class findUser extends findUsers {
  @ApiProperty()
  phone_number: string;
}
