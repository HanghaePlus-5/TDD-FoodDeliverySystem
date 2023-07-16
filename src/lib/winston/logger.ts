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

  public info(msg: RequestApiLog | ResponseApiLog) {
    const maskedMsg = this.makeLogMessage(msg);
    this.logger.info(maskedMsg);
    this.sendLogToCloudWatch('INFO', maskedMsg);
  }

  public error(errmsg: ErrorApiLog) {
    const stringifiedMsg = JSON.stringify(errmsg);
    this.logger.error(stringifiedMsg);
    this.sendLogToCloudWatch('ERROR', stringifiedMsg);
  }

  public debug(msg: string) {
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
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
      logEvents,
    });

    this.cloudWatchClient.send(command);
  }

  private makeLogMessage(msgs: RequestApiLog | ResponseApiLog | ErrorApiLog): string {
    if ('Headers' in msgs) {
      const Headers = this.filterSensitiveHeaders(msgs.Headers);
      msgs.Headers = Headers;
    }
    if ('Body' in msgs) {
      const Body = this.filterSensitiveBody(msgs.Body);
      msgs.Body = Body;
    }
    return JSON.stringify(msgs);
  }

  private filterSensitiveHeaders(headers: string[]): string[] {
    const sensitiveHeaders = ["authorization", "cookie", "host"];
    const regex = new RegExp(sensitiveHeaders.join("|"), "gi");
  
    return headers.map((header) => {
      if (regex.test(header)) {
        return '*** Sensitive Data ***';
      }
      return header;
    });
  }

  private filterSensitiveBody(body: string): string {
    const sensitiveWords = ["password", "email", "card"];
    const regex = new RegExp(sensitiveWords.join("|"), "gi");
  
    if (regex.test(body)) {
      return '*** Sensitive Data ***';
    }
    return body;
  }
}
