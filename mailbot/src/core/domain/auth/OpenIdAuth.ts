import { AbstractModel } from "../common/AbstractModel";

type OpenIdAuthOpts = {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  updatedAt: Date;
  createdAt: Date;
  clientId: string;
  clientSecret: string;
};

export class OpenIdAuth extends AbstractModel {
  constructor(opts: Partial<OpenIdAuthOpts>) {
    super(opts);
  }

  public setId(id: string) {
    this.set("id", id);
  }

  public getId(): string {
    return this.get("id");
  }

  public getAccessToken(): string {
    return this.get("accessToken");
  }

  public getRefreshToken(): string {
    return this.get("refreshToken");
  }

  public setAccessToken(accessToken: string): void {
    this.set("accessToken", accessToken);
  }

  public setRefreshToken(refreshToken: string): void {
    this.set("refreshToken", refreshToken);
  }

  public getClientId(): string {
    return this.get("clientId");
  }

  public setClientId(clientId: string): void {
    this.set("clientId", clientId);
  }

  public getClientSecret(): string {
    return this.get("clientSecret");
  }

  public setClientSecret(clientSecret: string): void {
    this.set("clientSecret", clientSecret);
  }

  public getUserId(): string {
    return this.get("userId");
  }

  public setUserId(userId: string): void {
    this.set("userId", userId);
  }

  public setUpdatedAt(updatedAt: Date) {
    this.set("updatedAt", updatedAt);
  }

  public getUpdatedAt(): Date {
    return this.get("updatedAt");
  }

  public setCreatedAt(createdAt: Date) {
    this.set("createdAt", createdAt);
  }

  public getCreatedAt(): Date {
    return this.get("createdAt");
  }
}
