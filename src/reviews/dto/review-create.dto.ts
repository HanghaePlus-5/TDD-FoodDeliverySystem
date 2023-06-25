import { ReviewDto } from './review.dto';

export type ReviewCreateDto = Pick<ReviewDto, 'content'|'score'>
