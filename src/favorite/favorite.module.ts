import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { Favorites } from './favorites.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Favorites])],
  controllers: [FavoriteController],
  providers: [FavoriteService, JwtService, ConfigService],
  exports: [FavoriteService],
})
export class FavoriteModule {} 