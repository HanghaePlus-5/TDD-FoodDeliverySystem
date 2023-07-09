export interface StoreDto {
  /**
   * @type int
   */
  storeId: number;

  /**
   * @type string
   * @pattern ^[^a-zA-Z!@#$%^&*(),.?":{}|<>]+$
   */
  name: string;

  /**
   * @type StoreType
   */
  type: StoreType;

  /**
   * @type StoreStatus
   */
  status: StoreStatus;

  /**
   * @type int
   * @length 12
   */
  businessNumber: string;

  /**
   * @type int
   * @minLength 11
   * @maxLength 13
   */
  phoneNumber: string;

  /**
   * @type int
   * @length 5
   */
  postalNumber: string;

  /**
   * @type string
   * @minLength 1
   */
  address: string;

  /**
   * @type int
   * @minimum 0
   * @maximum 23
   */
  openingTime: number;

  /**
   * @type int
   * @minimum 0
   * @maximum 23
   */
  closingTime: number;

  /**
   * @type int
   */
  cookingTime: number;

  /**
   * @type int
   */
  reviewNumber: number;

  /**
   * @type int
   */
  averageScore: number;

  /**
   * @type string
   */
  origin: string;

  /**
   * @type string
   */
  description: string;

  /**
   * @type date
   */
  registrationDate: Date;

  /**
   * @type int
   */
  userId: number;
}

export type StoreOptionalDto = Partial<StoreDto>

export interface StoreOwnedDto {
  /**
   * @type int
   */
  storeId: number;

  /**
   * @type int
   */
  userId: number;
}

export interface StoreStatusDto {
  /**
   * @type int
   */
  storeId: number;

  /**
   * @type StoreStatus
   */
  status: StoreStatus;
}
