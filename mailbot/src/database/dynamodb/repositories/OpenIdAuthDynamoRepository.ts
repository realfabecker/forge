import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";

import { OpenIdAuthMappter } from "src/adapters/mappers/OpenIdAuthMapper";
import { OpenIdAuth } from "src/core/domain/auth/OpenIdAuth";
import { DomainResult } from "src/core/domain/common/DomainResult";
import { UnableToCreateOpenId } from "src/core/domain/errors/UnableToCreateOpenId";
import { IOpenIdAuthRepository } from "src/core/ports/IOpenIdAuthRepository";

export class OpenIdAuthDynamoRepository implements IOpenIdAuthRepository {
  private readonly client: DynamoDBDocumentClient;

  constructor(private readonly tableName: string) {
    let config: DynamoDBClientConfig = {
      region: "us-east-1",
    };
    if (process.env.AWS_ENDPOINT) {
      config = {
        ...config,
        endpoint: process.env.AWS_ENDPOINT,
      };
    }
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient(config));
  }

  async save(openIdAuth: OpenIdAuth): Promise<DomainResult<OpenIdAuth>> {
    try {
      const message = OpenIdAuthMappter.toPersistence(openIdAuth);
      if (!message.getCreatedAt()) {
        message.setCreatedAt(new Date().toISOString());
      }
      message.setUpdatedAt(new Date().toISOString());
      const command = new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              Item: message.serialize(),
              TableName: this.tableName,
            },
          },
        ],
      });
      const result = await this.client.send(command);
      if (result.$metadata.httpStatusCode !== 200) {
        return DomainResult.Error(new UnableToCreateOpenId());
      }
      return DomainResult.Ok(openIdAuth);
    } catch (e) {
      return DomainResult.Error(<Error>e);
    }
  }

  async findById(
    userId: string,
    openId: string,
  ): Promise<DomainResult<OpenIdAuth | null>> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: {
          PK: `app#mailbot#user#${userId}`,
          SK: `openidauth#${openId}`,
        },
      });
      const result = await this.client.send(command);
      if (result.$metadata.httpStatusCode !== 200) {
        return DomainResult.Error(new UnableToCreateOpenId());
      }
      if (!result.Item) {
        return DomainResult.Ok(null);
      }
      return DomainResult.Ok(OpenIdAuthMappter.fromPersistence(result.Item));
    } catch (e) {
      return DomainResult.Error(<Error>e);
    }
  }
}
