/* eslint-disable */
interface RequestApiLog {
  identify: string;
  Request: string;
  Headers: string[];
  Body: string;
}

interface ResponseApiLog {
  identify: string;
  Response: string;
  Headers: string[];
  Body: string;
}

interface ErrorApiLog {
  // TODO identify: string;
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