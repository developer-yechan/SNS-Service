import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class QueryParams {
  @ApiProperty({
    required: false,
    description:
      'createdAt(작성일), like_num(좋아요 수), hits(조회 수) 기준으로 정렬',
  })
  @IsOptional()
  orderBy: 'createdAt' | 'like_num' | 'hits';

  @ApiProperty({
    required: false,
    description: '오름/내림 차순 정렬 방식 결정',
  })
  @IsOptional()
  order: 'DESC' | 'ASC';

  @ApiProperty({
    required: false,
    description: 'title field에서 search keyword 검색',
  })
  @IsOptional()
  search: string;

  @ApiProperty({
    required: false,
    description: '해시태그 검색을 통한 게시물 필터링',
  })
  @IsOptional()
  filter: string;

  @ApiProperty({ required: false, description: '게시글 수 조정' })
  @IsOptional()
  cnt: number;
}
