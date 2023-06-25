import { ReviewDto } from './review.dto';

export interface ReviewCreateDto extends Pick<ReviewDto, 'content'|'score'> {}