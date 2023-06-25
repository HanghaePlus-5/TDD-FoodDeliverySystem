import { UserDto } from 'src/users/dto';

export interface FavouriteDto {
  /**
   * Favourite PK
   * @type int
   */
  favouriteId: number;

  /**
   * User FK
   * @type int
   */
  userId: number;
  user?: UserDto;

  /**
   * Store FK
   * @type int
   */
  storeId: number;
  store?: any;
}