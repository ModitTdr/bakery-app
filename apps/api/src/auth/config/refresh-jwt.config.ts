import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs('refresh-jwt', (): JwtSignOptions => {
  const secret = process.env.JWT_REFRESH_SECRET as string;
  if (!secret) {
    throw new Error('JWT refresh secret is not defined in configuration');
  }
  return {
    secret: secret,
    expiresIn: '7d',
  };
});
