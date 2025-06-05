import { MessageCrawler } from "src/core/domain/crawler/MessageCrawler";

export interface IMessageCrawlerConfigRepository {
  getCrawler(id: string): Promise<MessageCrawler>;
}
