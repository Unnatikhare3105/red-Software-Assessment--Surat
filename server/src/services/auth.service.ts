import { userRepository } from '../repositories/user.repository';
import { generateUuid } from '../utils/generateUUID';
import { ApiError } from '../utils/ApiError';
import { hashPassword, comparePassword } from '../utils/password.util';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  TokenPayload,
} from '../utils/jwt.util';
import { redisClient } from '../config/redis.config';

const refreshKey = (userUuid: string) => `refreshToken:${userUuid}`;
const blacklistKey = (token: string) => `blacklist:${token}`;

function buildTokenPayload(user: { uuid: string; _id: unknown; email: string; role: string }): TokenPayload {
  return { _id: String(user._id), uuid: user.uuid, email: user.email, role: user.role };
}

async function issueTokens(user: { uuid: string; _id: unknown; email: string; role: string }) {
  const payload = buildTokenPayload(user);
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // single active session per user — overwritten on every login/refresh (rotation)
  await redisClient.set(refreshKey(user.uuid), refreshToken, 'EX', 7 * 24 * 60 * 60);

  return { accessToken, refreshToken };
}

export const authService = {
  async register(data: { name: string; email: string; password: string }) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw ApiError.conflict('Email already registered');

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.create({
      uuid: generateUuid(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'user',
    });

    const tokens = await issueTokens(user);
    return {
      user: { uuid: user.uuid, name: user.name, email: user.email, role: user.role },
      ...tokens,
    };
  },

  async login(data: { email: string; password: string }) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) throw ApiError.unauthorized('Invalid email or password');

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

    const tokens = await issueTokens(user);
    return {
      user: { uuid: user.uuid, name: user.name, email: user.email, role: user.role },
      ...tokens,
    };
  },

  async logout(accessToken: string, userUuid: string, exp: number) {
    const remainingSeconds = exp - Math.floor(Date.now() / 1000);
    if (remainingSeconds > 0) {
      await redisClient.set(blacklistKey(accessToken), '1', 'EX', remainingSeconds);
    }
    await redisClient.del(refreshKey(userUuid));
  },

  async refresh(refreshToken: string) {
    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const storedToken = await redisClient.get(refreshKey(decoded.uuid));
    if (!storedToken || storedToken !== refreshToken) {
      throw ApiError.unauthorized('Refresh token not recognized — please log in again');
    }

    const user = await userRepository.findByUuid(decoded.uuid);
    if (!user) throw ApiError.unauthorized('User no longer exists');

    return issueTokens(user);
  },
};