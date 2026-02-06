import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryService } from 'src/category/category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ProductService {
  constructor(
    private readonly category: CategoryService,
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    images: Express.Multer.File[],
  ) {
    const category = await this.category.findOne(createProductDto.categoryId);
    if (!category) throw new NotFoundException('Category not found');

    try {
      const uploadedImages: UploadApiResponse[] = await Promise.all(
        images.map((image) => this.cloudinary.uploadImage(image)),
      );

      const product = await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          description: createProductDto.description,
          price: createProductDto.price,
          categoryId: createProductDto.categoryId,
          productImages: {
            create: uploadedImages.map((img) => ({
              url: img.secure_url,
              publicId: img.public_id,
            })),
          },
        },
        include: {
          productImages: true,
          category: true,
        },
      });

      return {
        message: 'Product created successfully',
        data: product,
      };
    } catch {
      throw new InternalServerErrorException(
        'Failed to create product with images',
      );
    }
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: { productImages: { take: 1 }, category: true },
    });
    if (!products) throw new NotFoundException('Product not found');
    return products;
  }
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { productImages: true, category: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    images?: Express.Multer.File[],
  ) {
    await this.findOne(id);

    let uploadedImages: UploadApiResponse[] = [];
    if (images && images.length > 0) {
      for (const file of images) {
        if (!file.mimetype.startsWith('image/')) {
          throw new BadRequestException('Only image files are allowed');
        }
        if (file.size > 5_000_000) {
          throw new BadRequestException('Image size must be under 5MB');
        }
      }
      uploadedImages = await Promise.all(
        images.map((image) => this.cloudinary.uploadImage(image)),
      );
    }
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        ...(uploadedImages.length > 0 && {
          productImages: {
            create: uploadedImages.map((img) => ({
              url: img.secure_url,
              publicId: img.public_id,
            })),
          },
        }),
      },
      include: { productImages: true },
    });
    return {
      message: 'Product updated successfully',
      data: updatedProduct,
    };
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (product.productImages.length > 0) {
      await Promise.all(
        product.productImages.map((img) =>
          this.cloudinary.deleteImage(img.publicId),
        ),
      );
    }
    await this.prisma.product.delete({ where: { id } });
    return {
      message: 'Product deleted successfully',
    };
  }

  async removeImg(id: string) {
    const img = await this.prisma.productImage.findUnique({
      where: { id },
    });
    if (!img) throw new NotFoundException('Image not found on Cloudinary');

    const result = await this.cloudinary.deleteImage(img.publicId);
    if (result.result !== 'ok')
      throw new NotFoundException('Image not found on Cloudinary');

    await this.prisma.productImage.delete({ where: { id } });

    return {
      message: 'Image deleted successfully',
    };
  }
}
