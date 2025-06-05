import axios from "axios";
import { OpenIdAuth } from "src/core/domain/auth/OpenIdAuth";
import { DomainResult } from "src/core/domain/common/DomainResult";
import { OpenIdAuthDoestNotExists } from "src/core/domain/errors/OpenIdAuthDoesNotExists";
import { IOpenIdAuthProvider } from "src/core/ports/IOpenIdAuthProvider";
import { IOpenIdAuthRepository } from "src/core/ports/IOpenIdAuthRepository";

export class GoogleOpenIdProvider implements IOpenIdAuthProvider {
  constructor(private readonly opendIdRepository: IOpenIdAuthRepository) {}

  public async login(userId: string, openId: string): Promise<DomainResult> {
    const openIdAuth = await this.opendIdRepository.findById(userId, openId);
    if (!openIdAuth.getPayload()) {
      return DomainResult.Error(new OpenIdAuthDoestNotExists());
    }

    const refreshTokenResult = await this.refresh(openIdAuth.getPayload()!);
    if (!refreshTokenResult.isSuccess()) {
      return refreshTokenResult;
    }

    openIdAuth.getPayload()?.setAccessToken(refreshTokenResult.getPayload());
    return this.opendIdRepository.save(openIdAuth.getPayload()!);
  }

  private async refresh(openIdAuth: OpenIdAuth): Promise<DomainResult<string>> {
    try {
      const response = await axios
        .create({
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .post<{
          access_token: string;
          expires_in: number;
          scope: string;
          token_type: string;
          id_token: string;
          refresh_token_expires_in: number;
        }>(`https://oauth2.googleapis.com/token`, {
          grant_type: "refresh_token",
          client_id: openIdAuth.getClientId(),
          client_secret: openIdAuth.getClientSecret(),
          refresh_token: openIdAuth.getRefreshToken(),
        });
      return DomainResult.Ok(response.data.access_token);
    } catch (e) {
      return DomainResult.Error(
        new Error(`unable to refresh token: ${(<Error>e).message}`),
      );
    }
  }
}
