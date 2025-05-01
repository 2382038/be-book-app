import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Books } from './books.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Books])],
  controllers: [BookController],
  providers: [BookService, JwtService, ConfigService],
  exports: [BookService],
})
export class BookModule {} 