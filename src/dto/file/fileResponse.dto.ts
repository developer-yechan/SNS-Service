import { ApiProperty } from '@nestjs/swagger';

export class uploadResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  imageUrl: string;
  @ApiProperty()
  postId: number;
}
