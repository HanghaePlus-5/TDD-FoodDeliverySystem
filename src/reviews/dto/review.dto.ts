import { UserDto } from "src/users/dto";

export interface ReviewDto {
  /**
   * Review PK
   * @type int
   */
  reviewId: number;

  /**
   * User FK
   * @type int
   */
  userId: number;
  user?: UserDto;

  /**
   * Order FK
   * @type int
   */
  orderId: number;
  order?: any;

  /**
   * Review content
   */
  content: string;

  /**
   * Review score
   * @type int
   */
  score: number;
  
  createdAt: Date;
  updatedAt: Date;
}