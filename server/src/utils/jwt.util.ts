import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/env.config';

export interface TokenPayload {
  _id: string;
  uuid: string;
  email: string;
  role: string;
}

export const signAccessToken = (payload: TokenPayload): string =>
  jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
  });

export const signRefreshToken = (payload: TokenPayload): string =>
  jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });

export const verifyAccessToken = (token: string): TokenPayload & JwtPayload =>
  jwt.verify(token, config.jwt.accessSecret) as TokenPayload & JwtPayload;

export const verifyRefreshToken = (token: string): TokenPayload & JwtPayload =>
  jwt.verify(token, config.jwt.refreshSecret) as TokenPayload & JwtPayload;