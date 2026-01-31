import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticatedUser } from './types/auth.user';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshAuthGuard } from './guards/refresh-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@Request() req: { user: AuthenticatedUser }) {
    return this.authService.login(req.user.id, req.user.name);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  logout(@Request() req: { user: { sub: string } }) {
    return this.authService.logout(req.user.sub);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Request() req: { user: { sub: string; refreshToken: string } }) {
    return this.authService.refreshToken(req.user.sub, req.user.refreshToken);
  }

  @UseGuards(JwtGuard)
  @Get('test')
  test() {
    return { msg: 'authorized' };
  }
}
