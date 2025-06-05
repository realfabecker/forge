import { DomainResult } from "src/core/domain/common/DomainResult";
import { EmailListFilter } from "src/core/domain/email/EmailListFilter";
import { EmailMessage } from "src/core/domain/email/EmailMessage";
import { MessageType } from "src/core/domain/enums/MessageType";
import { OperationType } from "src/core/domain/enums/OperationType";
import { CrawlerDoesNotExists } from "src/core/domain/errors/CrawlerDoesNotExists";
import { IMessageCrawlerConfigRepository } from "src/core/ports/ICrawlerRepository";
import { IEmailMessageProvider } from "src/core/ports/IEmailMessageProvider";
import { ILogger } from "src/core/ports/ILogger";
import { IQueueProvider } from "src/core/ports/IQueueProvider";

type ScheduleMessageTypeImportOpts = {
  emailProvider: IEmailMessageProvider;
  crawlerRepository: IMessageCrawlerConfigRepository;
  queueProvider: IQueueProvider;
  logger: ILogger;
};

export class ScheduleMessageTypeImport {
  constructor(private readonly opts: ScheduleMessageTypeImportOpts) {}

  public async run({
    crawlerId,
  }: {
    crawlerId: string;
  }): Promise<DomainResult> {
    const crawler = await this.opts.crawlerRepository.getCrawler(crawlerId);
    if (!crawler) {
      return DomainResult.Error(new CrawlerDoesNotExists(crawlerId));
    }

    const filter = new EmailListFilter({ label: crawler.getProviderFilter() });
    const messagesResult = await this.opts.emailProvider.listUnread(filter);

    if (!messagesResult.isSuccess()) {
      return DomainResult.Error(new Error("não foi possível obter mensagens"));
    }

    if (!messagesResult.getPayload()?.length) {
      this.opts.logger.info("não há mensagens para o filtro");
      return DomainResult.Ok();
    }

    return this.schedule(messagesResult.getPayload() ?? []);
  }

  private async schedule(messages: EmailMessage[]) {
    for (const message of messages) {
      this.opts.logger.info(`schedule mensagem ${message.getId()}`);
      await this.opts.queueProvider.publish({
        meta: {
          operation: OperationType.ImportMessageDetails,
        },
        data: {
          messageId: message.getId(),
          messageType: MessageType.EnergyBill,
        },
      });
    }
    return DomainResult.Ok();
  }
}
