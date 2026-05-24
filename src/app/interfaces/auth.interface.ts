export interface LoginResponse {
  access_token: string;
  token_type: string; // e.g. "bearer"
  expires_in: number; // seconds until the token expires
}
