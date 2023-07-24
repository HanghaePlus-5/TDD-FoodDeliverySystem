import { Injectable } from '@nestjs/common';
import { CloudWatchLogsClient, PutLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';
import * as winston from 'winston';

import { EnvService } from 'src/config/env';

const { createLogger, transports } = winston;
const {
 combine, timestamp, colorize, printf, simple,
} = winston.format;

const logFormat = printf(
  (info) => `${info.timestamp} ${info.level}: ${info.message}`,
);

@Injectable()
export default class Logger {
  private logger: winston.Logger;
  private cloudWatchClient: CloudWatchLogsClient;
  logGroupName: string;
  logStreamName: string;

  constructor(private readonly env: EnvService) {
    this.logGroupName = this.env.get<string>('AWS_CLOUDWATCH_LOG_GROUP_NAME');
    this.logStreamName = this.env.get<string>('AWS_CLOUDWATCH_LOG_STREAM_NAME');
    const awsAccessKeyId = this.env.get<string>('AWS_ACCESS_KEY_ID');
    const awsSecretKey = this.env.get<string>('AWS_SECRET_ACCESS_KEY');
    const awsRegion = this.env.get<string>('AWS_REGION');

    this.logger = createLogger({
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat,
        ),
        silent: process.env.NODE_ENV === 'production',
      });

    this.cloudWatchClient = new CloudWatchLogsClient({
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretKey,
      },
      region: awsRegion,
    });

    this.logger.add(
      new transports.Console({
        format: combine(colorize(), simple()),
      }),
    );
  }

  public info(msg: RequestApiLog | ResponseApiLog | CustomObjApiLog | CustomMsgApiLog) {
    const maskedMsg = this.makeLogMessage(msg);
    this.logger.info(maskedMsg);
    this.sendLogToCloudWatch('INFO', maskedMsg);
  }

  public warn(msg: CustomObjApiLog | CustomMsgApiLog) {
    const maskedMsg = this.makeLogMessage(msg);
    this.logger.warn(maskedMsg);
    this.sendLogToCloudWatch('WARN', maskedMsg);
  }

  public error(errmsg: ErrorApiLog) {
    const stringifiedMsg = JSON.stringify(errmsg);
    this.logger.error(stringifiedMsg);
    this.sendLogToCloudWatch('ERROR', stringifiedMsg);
  }

  public dbError(msg: DatabaseErrorLog) {
    const stringifiedMsg = JSON.stringify(msg);
    this.logger.error(stringifiedMsg);
    this.sendLogToCloudWatch('DB_ERROR', stringifiedMsg);
  }

  public debug(msg: CustomObjApiLog | CustomMsgApiLog) {
    this.logger.debug(msg);
  }

  private sendLogToCloudWatch(level: string, msg: string) {
    const logEvents = [
      {
        timestamp: new Date().getTime(),
        message: `[${level}] : ${msg}`,
      },
    ];
    const command = new PutLogEventsCommand({
      logGroupName: `${this.logGroupName}-${level}`,
      logStreamName: this.logStreamName,
      logEvents,
    });

    this.cloudWatchClient.send(command);
  }

  private makeLogMessage(msgs: RequestApiLog | ResponseApiLog | CustomObjApiLog | CustomMsgApiLog): string {
    const modifiedMsgs = { ...msgs }; // Create a copy of the msgs object

    if ('Headers' in modifiedMsgs) {
      modifiedMsgs.Headers = this.filterSensitiveHeaders(modifiedMsgs.Headers);
    }

    if ('Body' in modifiedMsgs) {
      modifiedMsgs.Body = this.filterSensitiveBody(modifiedMsgs.Body);
    }

    if ('Request' in modifiedMsgs) {
      modifiedMsgs.Request = this.filterSensitiveBody(modifiedMsgs.Request);
    }

    if ('Message' in modifiedMsgs) {
      modifiedMsgs.Message = this.filterSensitiveBody(modifiedMsgs.Message);
    }

    return JSON.stringify(modifiedMsgs);
  }

  private filterSensitiveHeaders(headers: OutgoingHttpHeaders): OutgoingHttpHeaders {
    const sensitiveHeaders = ['authorization', 'cookie', 'host'];
    const regex = new RegExp(sensitiveHeaders.join('|'), 'gi');

    const maskedHeaders: OutgoingHttpHeaders = {};

    Object.entries(headers).forEach(([key, value]) => {
      if (regex.test(key)) {
        maskedHeaders[key] = '*** Sensitive Data ***';
      } else {
        maskedHeaders[key] = value;
      }
    });

    return maskedHeaders;
  }

  private filterSensitiveBody(body: string | KeyValues): string {
    const sensitiveWords = ['password', 'email', 'card'];
    const regex = new RegExp(sensitiveWords.join('|'), 'gi');

    if (typeof body === 'string') {
      if (regex.test(body)) {
        return '*** Sensitive Data ***';
      }
      return body;
    }

    if (typeof body === 'object') {
      const maskedBody: KeyValues = {};

      Object.entries(body).forEach(([key, value]) => {
        if (regex.test(key)) {
          maskedBody[key] = '*** Sensitive Data ***';
        } else {
          maskedBody[key] = value;
        }
      });

      return JSON.stringify(maskedBody);
    }

    return '';
  }
}
