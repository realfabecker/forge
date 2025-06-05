import { EnergyBillMapper } from "src/adapters/mappers/EnergyBillMapper";
import { DomainResult } from "src/core/domain/common/DomainResult";
import { CrawlerDoesNotExists } from "src/core/domain/errors/CrawlerDoesNotExists";
import { NotEnoughtMessageDetails } from "src/core/domain/errors/NotEnoughMessageDetails";
import { IMessageCrawlerConfigRepository } from "src/core/ports/ICrawlerRepository";
import { IEmailMessageProvider } from "src/core/ports/IEmailMessageProvider";
import { IEnergyBillRepository } from "src/core/ports/IEnergyBillRepository";
import { IMessageDetailExtractor } from "src/core/ports/IMessageDetailExtractor";

type ImportMessageTypeDetailsOpts = {
  emailProvider: IEmailMessageProvider;
  crawlerRepository: IMessageCrawlerConfigRepository;
  detailExtractor: IMessageDetailExtractor;
  energyBillRepository: IEnergyBillRepository;
};

export class ImportMessageTypeDetails {
  public constructor(private readonly opts: ImportMessageTypeDetailsOpts) {}

  public async run({
    userId,
    crawlerId,
    messageId,
  }: {
    userId: string;
    messageId: string;
    crawlerId: string;
  }): Promise<DomainResult> {
    const crawler = await this.opts.crawlerRepository.getCrawler(crawlerId);
    if (!crawler) {
      return DomainResult.Error(new CrawlerDoesNotExists(crawlerId));
    }

    const getEmailMessage = await this.opts.emailProvider.getMessage(messageId);
    if (!getEmailMessage.isSuccess()) return getEmailMessage;

    const extractDetails = this.opts.detailExtractor.extract(
      crawler,
      getEmailMessage.getPayload(),
    );
    if (!extractDetails.isSuccess()) {
      return DomainResult.Error(new NotEnoughtMessageDetails(messageId));
    }

    const energyBill = EnergyBillMapper.fromPayload(
      getEmailMessage.getPayload(),
      userId,
      extractDetails.getPayload(),
    );
    if (!Object.keys(energyBill)) {
      return DomainResult.Error(new NotEnoughtMessageDetails(messageId));
    }

    const saveEnegyBil = await this.opts.energyBillRepository.save(energyBill);
    if (!saveEnegyBil.isSuccess()) return saveEnegyBil;

    return this.opts.emailProvider.markAsRead(messageId);
  }
}
