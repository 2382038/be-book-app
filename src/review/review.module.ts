import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Reviews } from './reviews.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Reviews])],
  controllers: [ReviewController],
  providers: [ReviewService, JwtService, ConfigService],
  exports: [ReviewService],
})
export class ReviewModule {} 