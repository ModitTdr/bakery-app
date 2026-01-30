import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async signup(signupDto: SignUpDto) {
    const user = await this.userService.findByEmail(signupDto.email);
    if (user) throw new ConflictException('User already exists');

    const hashedPassword = await argon2.hash(signupDto.password);
    return this.userService.create({
      ...signupDto,
      password: hashedPassword,
    });
  }

  async validateLocalUser(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    console.log('logindto', loginDto);
    console.log('user', user);
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
    };
  }
}
