import winston from 'winston';
import winstonCloudwatch, { LogObject } from 'winston-cloudwatch';

import { EnvService } from 'src/config/env';

const { createLogger, transports } = winston;
const { combine, timestamp, colorize, printf, simple } = winston.format;

const logFormat = printf(
  (info) => `${info.timestamp} ${info.level}: ${info.message}`,
)

export default class Logger {
  private logger: winston.Logger;
  
  constructor(private readonly env: EnvService) {
    const logGroupName = this.env.get<string>('AWS_CLOUDWATCH_LOG_GROUP_NAME');
    const logStreamName = this.env.get<string>('AWS_CLOUDWATCH_LOG_STREAM_NAME');
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
      })

    const config = {
      logGroupName,
      logStreamName,
      awsAccessKeyId,
      awsSecretKey,
      awsRegion,
      messageFormatter: (logObject: LogObject) => {
        const { level, message, additionalInfo } = logObject;
        return `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(
          additionalInfo,
        )}`;
      },
      awsOptions: {
        credentials: {
          accessKeyId: awsAccessKeyId,
          secretAccessKey: awsSecretKey,
        },
        region: awsRegion,
      },
    };
    const cloudWatchHelper = new winstonCloudwatch(config);
    this.logger.add(cloudWatchHelper);    
  }

  public info(msg: string) {
    this.logger.info(msg);
  }

  public error(errmsg: string) {
    this.logger.error(errmsg);
  }
}