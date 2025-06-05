import { DomainResult } from "src/core/domain/common/DomainResult";
import { Attachment } from "src/core/domain/invoices/Attachment";
import { EnergyBill } from "src/core/domain/invoices/EnergyBill";
import { IEmailMessageProvider } from "src/core/ports/IEmailMessageProvider";
import { IEnergyBillRepository } from "src/core/ports/IEnergyBillRepository";
import { ILogger } from "src/core/ports/ILogger";
import { IObjectStorageRepository } from "src/core/ports/IObjectStorageRepository";

export class ImportMessageAttachment {
  public constructor(
    private readonly emailProvider: IEmailMessageProvider,
    private readonly energyBillRepository: IEnergyBillRepository,
    private readonly objectStorageRepository: IObjectStorageRepository,
    private readonly logger: ILogger,
  ) {}

  public async run({
    userId,
    crawlerId,
    messageId,
  }: {
    userId: string;
    crawlerId: string;
    messageId: string;
  }): Promise<DomainResult> {
    const fetchMessageResult = await this.energyBillRepository.findById(
      userId,
      messageId,
    );
    if (!fetchMessageResult.getPayload()) {
      return DomainResult.Error(new Error(`msg ${messageId} not exists`));
    }
    if (!fetchMessageResult.getPayload()?.getAttachment()?.length) {
      this.logger.info(`msg ${messageId} has no attachs`);
      return DomainResult.Ok();
    }
    return this.processAttachments(
      fetchMessageResult.getPayload() as EnergyBill,
    );
  }

  protected async processAttachments(energyBill: EnergyBill) {
    for (const attachment of energyBill.getAttachment()) {
      const fetchAndSaveResult = await this.fetchAndSaveAttachment(
        energyBill.getExternalId(),
        attachment,
      );
      if (!fetchAndSaveResult.isSuccess()) {
        return fetchAndSaveResult;
      }
    }
    return DomainResult.Ok();
  }

  protected async fetchAndSaveAttachment(
    externalId: string,
    attachment: Attachment,
  ) {
    const getAttachmentResult = await this.emailProvider.getAttachment(
      externalId,
      attachment.getExternalId(),
    );
    if (!getAttachmentResult.isSuccess()) {
      return getAttachmentResult;
    }
    return this.objectStorageRepository.upload({
      key: attachment.getObjectUrl(),
      content: getAttachmentResult.getPayload(),
      contentEncoding: attachment.getContentEncoding(),
      contentType: attachment.getContentType(),
    });
  }
}
