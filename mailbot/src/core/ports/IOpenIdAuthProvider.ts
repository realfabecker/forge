import { DomainResult } from "../domain/common/DomainResult";

export interface IOpenIdAuthProvider {
  login(userId: string, openId: string): Promise<DomainResult>;
}
