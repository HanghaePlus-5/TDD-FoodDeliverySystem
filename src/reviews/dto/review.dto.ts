import { UserDto } from "src/users/dto";

export interface ReviewDto {
  reviewId: number;
  userId: number;
  user?: UserDto;
  orderId: number;
  order?: any;
  content: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}