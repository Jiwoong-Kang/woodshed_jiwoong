import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts() {
    const products = await this.productRepository.find();
    return { count: products.length, data: products };
  }

  async postProduct(createProductDto: CreateProductDto) {
    const newProduct = await this.productRepository.create(createProductDto);
    await this.productRepository.save(newProduct);
    return newProduct;
  }

  async getProduct(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async deleteProducts() {
    const deleteResponse = await this.productRepository.delete({});
    if (!deleteResponse.affected) {
      throw new HttpException('Something new Error', HttpStatus.BAD_REQUEST);
    }
    return 'Deleted all products';
  }

  async deleteProductById(id: string) {
    const deleteResponse = await this.productRepository.delete({ id });
    if (!deleteResponse.affected) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return 'Deleted a product';
  }

  async updateProductById(id: string, updateProductDto: CreateProductDto) {
    await this.productRepository.update(id, updateProductDto);
    const updateProduct = await this.productRepository.findOneBy({ id });
    if (!updateProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return updateProduct;
  }
}
