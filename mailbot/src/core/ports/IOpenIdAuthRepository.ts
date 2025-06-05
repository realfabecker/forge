import { OpenIdAuth } from "../domain/auth/OpenIdAuth";
import { DomainResult } from "../domain/common/DomainResult";

export interface IOpenIdAuthRepository {
  save(openIdAuth: OpenIdAuth): Promise<DomainResult<OpenIdAuth>>;
  findById(
    userId: string,
    id: string,
  ): Promise<DomainResult<OpenIdAuth | null>>;
}
