import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './create-favorite.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto, @Request() req) {
    return this.favoriteService.create(createFavoriteDto, req.user.sub);
  }

  @Get()
  findAll(@Request() req) {
    return this.favoriteService.findAll(req.user.sub);
  }

  @Get('check/:bookId')
  async isFavorited(@Param('bookId') bookId: string, @Request() req) {
    return {
      isFavorited: await this.favoriteService.isBookFavorited(+bookId, req.user.sub),
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.favoriteService.remove(+id, req.user.sub);
  }

  @Delete('book/:bookId')
  removeByBookId(@Param('bookId') bookId: string, @Request() req) {
    return this.favoriteService.removeByBookId(+bookId, req.user.sub);
  }
} 