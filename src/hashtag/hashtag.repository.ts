import { CustomRepository } from 'src/decorator/typeorm-ex.decorator';
import { Hashtag } from 'src/entity/hashtag.entity';
import { Repository } from 'typeorm';

@CustomRepository(Hashtag)
export class HashtagRepository extends Repository<Hashtag> {
  async findHashtags(newHashtagArr: string[]) {
    const hashtags = await this.createQueryBuilder()
      .select(['id', 'hashtag'])
      .where('hashtag IN (:...hashtags)', { hashtags: newHashtagArr })
      .getRawMany();
    return hashtags;
  }
}
