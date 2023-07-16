/* eslint-disable */
interface RequestApiLog {
  Session: string;
  Request: string;
  Headers: string[];
  Body: string;
}

interface ResponseApiLog {
  Session: string;
  Response: string;
  Headers: string[];
  Body: string;
}

interface ErrorApiLog {
  Session: string;
  Message: string;
  Stack: string;
}
