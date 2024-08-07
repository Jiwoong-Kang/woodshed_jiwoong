import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserbyId(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  async getUserbyEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }
}
