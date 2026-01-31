import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return { message: 'Category created successfully', data: category };
  }

  async findAll() {
    return this.prisma.category.findMany();
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException('At least one field must be provided');
    }
    const category = await this.prisma.category.update({
      where: { id },
      data: dto,
    });

    return { message: 'Category updated', data: category };
  }

  async delete(categoryId: string) {
    try {
      await this.prisma.category.delete({
        where: { id: categoryId },
      });
      return { message: 'Category deleted' };
    } catch {
      throw new BadRequestException('Failed to delete category');
    }
  }
}
