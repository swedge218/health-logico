export enum AuthConstants {
    TOKEN_INVALID = 0,
    TOKEN_VALID = 1
}

export const jwtConstants = {
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    access_token_expiry: process.env.ACCESS_TOKEN_EXPIRY,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expiry: process.env.REFRESH_TOKEN_EXPIRY
};