import { BeforeInsert, Column, Entity } from 'typeorm';
import BaseEntity from '../../common/base.entity';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';
import { InternalServerErrorException } from '@nestjs/common';

@Entity()
export class User extends BaseEntity {
  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column()
  public profileImage: string;

  @BeforeInsert()
  async beforeSaveFunction() {
    try {
      const saltValue = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, saltValue);

      this.profileImage = gravatar.url(this.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
        protocol: 'https',
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
