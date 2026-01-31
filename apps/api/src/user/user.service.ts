import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
      select: { id: true, email: true, name: true },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: string, data: UpdateUserDto) {
    {
      return this.prisma.user.updateMany({
        where: { id },
        data,
      });
    }
  }

  logout(id: string) {
    return this.prisma.user.updateMany({
      where: {
        id,
        refreshToken: {
          not: null,
        },
      },
      data: { refreshToken: null },
    });
  }
}
