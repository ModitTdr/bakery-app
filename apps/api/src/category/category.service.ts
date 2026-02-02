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
    const name = createCategoryDto.name?.trim().toLowerCase();
    const existingCategory = await this.prisma.category.findUnique({
      where: { name },
    });
    if (existingCategory)
      throw new BadRequestException('Category already exists');

    const newCategory = await this.prisma.category.create({
      data: {
        name: name,
      },
    });
    return { message: 'Category created successfully', data: newCategory };
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
    const name = dto.name.trim().toLowerCase();
    if (!name) throw new BadRequestException('Name is required');

    const existingCategory = await this.prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory && existingCategory.id !== id)
      throw new BadRequestException('Category already exists');

    const category = await this.prisma.category.update({
      where: { id },
      data: { name },
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
