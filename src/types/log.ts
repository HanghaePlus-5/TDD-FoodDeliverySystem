import { Prisma } from '@prisma/client';

declare global {
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
  
  interface DatabaseErrorLog {
    userId: number;
    time: number;
    model: Prisma.ModelName | undefined;
    action: Prisma.PrismaAction;
    transaction: boolean;
    args: unknown;
    dataPath: string[];
  }
  
  interface CustomObjApiLog {
    // TODO identify: string;
    Request: string;
    // TODO Headers
    Body: KeyValues;
  }
  
  interface CustomMsgApiLog {
    // TODO identify: string;
    Request: string;
    Message: string;
  }
  
  interface OutgoingHttpHeaders {
    [key: string]: string | string[] | number | undefined;
  }
  
  interface KeyValues {
    [key: string]: string;
  }
}

export {}