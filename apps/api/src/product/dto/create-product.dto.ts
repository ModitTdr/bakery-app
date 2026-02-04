import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(500)
  description?: string;

  @IsNotEmpty()
  price: number;

  @IsString()
  @IsOptional()
  categoryId: string;
}
