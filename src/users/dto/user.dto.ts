export interface UserDto {
  /**
   * User PK
   * @type int
   */
  userId: number;

  /**
   * User email
   * @format email
   */
  email: string;

  /**
   * User name
   */
  name: string;

  /**
   * User password
   * @minLength 4
   * @maxLength 12
   */
  password: string;

  /**
   * User type
   * @type 'customer' | 'business'
   */
  type: UserType;
}
