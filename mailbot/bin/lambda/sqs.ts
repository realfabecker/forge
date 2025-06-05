import { ConsoleLogger } from "src/adapters/providers/ConsoleLogger";
import { GoogleEmailMessageProvider } from "src/adapters/providers/GoogleEmailMessageProvider";
import { RegexMessageDetailExtractor } from "src/adapters/providers/RegexMessageDetailExtractor";
import { SQSQueueProvider } from "src/adapters/providers/SQSQueueProvider";
import { EnergyBillDynamoDbRepository } from "src/database/dynamodb/repositories/EnergyBillDynamoRepository";
import { S3ObjectStorageRepository } from "src/database/s3/repositories/S3ObjectStorageRepository";
import { ImportMessageAttachment } from "src/features/ImportMessageAttachment";
import { ImportMessageTypeDetails } from "src/features/ImportMessageTypeDetails";
import { ScheduleMessageTypeImport } from "src/features/ScheduleMessageTypeImport";
import { SqsAsEventSourceHandler } from "src/handlers/lambda/SqsAsEventSourceHandler";
import { SQSEvent } from "aws-lambda";
import { MessageCrawlerConfigInMemRepository } from "src/database/inmem/repositories/MessageCrawlerConfigInMemRepository";

const logger = new ConsoleLogger();
const source = new SqsAsEventSourceHandler(
  logger,
  new ScheduleMessageTypeImport({
    emailProvider: new GoogleEmailMessageProvider(),
    crawlerRepository: new MessageCrawlerConfigInMemRepository(),
    queueProvider: new SQSQueueProvider(process.env.SQS_QUEUE_URL as string),
    logger,
  }),
  new ImportMessageTypeDetails({
    emailProvider: new GoogleEmailMessageProvider(),
    crawlerRepository: new MessageCrawlerConfigInMemRepository(),
    detailExtractor: new RegexMessageDetailExtractor(),
    energyBillRepository: new EnergyBillDynamoDbRepository("sintese"),
  }),
  new ImportMessageAttachment(
    new GoogleEmailMessageProvider(),
    new EnergyBillDynamoDbRepository("sintese"),
    new S3ObjectStorageRepository(),
    logger,
  ),
);

export const handler = async (event: SQSEvent) => {
  try {
    const result = await source.handler(event);
    if (!result.isSuccess()) {
      logger.error(result.getError().getErrorDescription());
    } else {
      logger.info("Operation completed");
    }
  } catch (e) {
    logger.error((<Error>e).message);
  }
};
