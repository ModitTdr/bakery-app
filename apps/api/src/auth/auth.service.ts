import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth.jwtpayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    @Inject(jwtConfig.KEY)
    private jConfig: ConfigType<typeof jwtConfig>,
  ) {}

  async signup(signupDto: SignUpDto) {
    const user = await this.userService.findByEmail(signupDto.email);
    if (user) throw new ConflictException('User already exists');

    const hashedPassword = await argon2.hash(signupDto.password);
    const newUser = await this.userService.create({
      ...signupDto,
      password: hashedPassword,
    });
    return {
      message: 'Registered successfully',
      data: newUser,
    };
  }

  async validateLocalUser(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isPasswordMatched = await argon2.verify(
      user.password,
      loginDto.password,
    );
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid credentials');

    return {
      id: user.id,
      name: user.name,
      role: user.role,
    };
  }

  async login(userId: string, name: string, role: string) {
    const { accessToken, refreshToken } = await this.generateToken({
      sub: userId,
      name,
      role,
    });
    await this.updateRefreshToken(userId, refreshToken);
    const response = {
      user: {
        id: userId,
        name: name,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
    return {
      message: 'User created successfully',
      date: response,
    };
  }

  async logout(userId: string) {
    await this.userService.logout(userId);
    return { message: 'Logout successful' };
  }

  async generateToken(
    payload: AuthJwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, this.jConfig),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await argon2.hash(refreshToken);
    return await this.userService.update(userId, { refreshToken: hashedToken });
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Access Denied');

    const isRefreshTokenMatched = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!isRefreshTokenMatched)
      throw new UnauthorizedException('Access Denied');

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateToken({
        sub: user.id,
        name: user.name,
        role: user.role,
      });

    await this.updateRefreshToken(user.id, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
