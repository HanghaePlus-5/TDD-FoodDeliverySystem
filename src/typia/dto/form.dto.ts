import { OptionsDto } from './options.dto';

export interface FormDto {
  /**
   * @minLength 4
   * @maxLength 10
   */
  name: string;

  /**
   * @format email
   */
  email: string;

  /**
   * @type int
   */
  age: number;

  options: OptionsDto;
}