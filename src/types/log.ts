/* eslint-disable */
interface RequestApiLog {
  Identify: string;
  Request: string;
  Headers: OutgoingHttpHeaders;
  Body: string;
}

interface ResponseApiLog {
  Identify: string;
  Response: string;
  Headers: OutgoingHttpHeaders;
  Body: string;
}

interface ErrorApiLog {
  Identify: string;
  Request: string;
  StatusCode: number;
  Message: string;
  Stack: string;
}

interface CustomApiLog {
  // TODO identify: string;
  Request: string;
  Message: string;
}

interface OutgoingHttpHeaders {
  [key: string]: string | string[] | number | undefined;
}
