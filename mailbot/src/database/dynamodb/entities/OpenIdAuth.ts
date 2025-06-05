import { AbstractModel } from "src/core/domain/common/AbstractModel";

export type OpenIdAuthOpts = {
  PK: string;
  SK: string;
  ID: string;
  UserId: string;
  AccessToken: string;
  RefreshToken: string;
  UpdatedAt?: string;
  CreatedAt?: string;
  ClientId: string;
  ClientSecret: string;
};

export class OpenIdAuth extends AbstractModel {
  constructor(opts: OpenIdAuthOpts) {
    super(opts);
  }

  public getPK(): string {
    return this.get("PK");
  }

  public setPK(pk: string) {
    this.set("PK", pk);
  }

  public getSK(): string {
    return this.get("SK");
  }

  public setSK(sk: string) {
    this.set("SK", sk);
  }

  public getAccessToken(): string {
    return this.get("AccessToken");
  }

  public getRefreshToken(): string {
    return this.get("RefreshToken");
  }

  public setAccessToken(accessToken: string): void {
    this.set("AccessToken", accessToken);
  }

  public setRefreshToken(refreshToken: string): void {
    this.set("RefreshToken", refreshToken);
  }

  public getUserId(): string {
    return this.get("UserId");
  }

  public setUserId(userId: string): void {
    this.set("UserId", userId);
  }

  public setUpdatedAt(updatedAt: string): void {
    this.set("UpdatedAt", updatedAt);
  }

  public getUpdatedAt(): string {
    return this.get("UpdatedAt");
  }

  public setCreatedAt(createdAt: string): void {
    this.set("CreatedAt", createdAt);
  }

  public getCreatedAt(): string {
    return this.get("CreatedAt");
  }

  public getClientId(): string {
    return this.get("ClientId");
  }

  public setClientId(clientId: string): void {
    this.set("ClientId", clientId);
  }

  public getClientSecret(): string {
    return this.get("ClientSecret");
  }

  public setClientSecret(clientSecret: string): void {
    this.set("ClientSecret", clientSecret);
  }

  public getID(): string {
    return this.get("ID");
  }

  public setID(id: string): void {
    this.set("ID", id);
  }
}
