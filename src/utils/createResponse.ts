interface ResponseForm<T> {
  result: true;
  data: T;
}

export const createResponse = <T>(data: T): ResponseForm<T> => ({
  result: true,
  data,
});