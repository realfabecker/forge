import { parseISO } from "date-fns";
import { OpenIdAuth as DomainOpenIdAuth } from "src/core/domain/auth/OpenIdAuth";
import { OpenIdAuth as PersistenceOpenIdAuth } from "src/database/dynamodb/entities/OpenIdAuth";

export class OpenIdAuthMappter {
  public static fromPersistence(openIdAuth: Record<string, any>) {
    return new DomainOpenIdAuth({
      id: openIdAuth.ID,
      userId: openIdAuth.UserId,
      accessToken: openIdAuth.AccessToken,
      refreshToken: openIdAuth.RefreshToken,
      updatedAt: parseISO(openIdAuth.UpdatedAt),
      createdAt: parseISO(openIdAuth.CreatedAt),
      clientId: openIdAuth.ClientId,
      clientSecret: openIdAuth.ClientSecret,
    });
  }

  public static toPersistence(openIdAuth: DomainOpenIdAuth) {
    return new PersistenceOpenIdAuth({
      PK: `app#mailbot#user#${openIdAuth.getUserId()}`,
      SK: `openidauth#${openIdAuth.getId()}`,
      ID: openIdAuth.getId(),
      UserId: openIdAuth.getUserId(),
      AccessToken: openIdAuth.getAccessToken(),
      RefreshToken: openIdAuth.getRefreshToken(),
      CreatedAt: openIdAuth.getCreatedAt?.()?.toISOString?.(),
      ClientId: openIdAuth.getClientId(),
      ClientSecret: openIdAuth.getClientSecret(),
    });
  }
}
