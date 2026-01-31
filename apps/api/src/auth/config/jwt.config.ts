import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs('jwt', (): JwtSignOptions => {
  const secret = process.env.JWT_SECRET as string;
  if (!secret)
    throw new Error('JWT secret is not defined in environment variables');
  return {
    secret,
    expiresIn: '60s',
  };
});
