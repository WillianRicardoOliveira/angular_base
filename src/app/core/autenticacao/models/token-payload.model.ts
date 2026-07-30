export interface TokenPayload {
    id: number;
    sub: string;
    jti: string;
    iss: string;
    exp: number;
}