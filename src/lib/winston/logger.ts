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

  public info(msg: string) {
    this.logger.info(msg);
    this.sendLogToCloudWatch('INFO', msg);
  }

  public error(errmsg: string) {
    this.logger.error(errmsg);
    this.sendLogToCloudWatch('ERROR', errmsg);
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
}
