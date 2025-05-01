import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorites } from './favorites.entity';
import { CreateFavoriteDto } from './create-favorite.dto';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorites)
    private favoriteRepository: Repository<Favorites>,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto, userId: number): Promise<Favorites> {
    try {
      // Check if already favorited
      const existingFavorite = await this.favoriteRepository.findOne({
        where: {
          user_id: userId,
          book_id: createFavoriteDto.book_id,
        },
      });

      if (existingFavorite) {
        throw new ConflictException('Book is already in favorites');
      }

      const favorite = this.favoriteRepository.create({
        ...createFavoriteDto,
        user_id: userId,
      });
      console.log('Attempting to save favorite:', favorite); // Debug log
      return await this.favoriteRepository.save(favorite);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      console.error('Error creating favorite:', error); // Error log
      throw new InternalServerErrorException('Failed to create favorite: ' + error.message);
    }
  }

  async findAll(userId: number): Promise<Favorites[]> {
    return await this.favoriteRepository.find({
      where: { user_id: userId },
    });
  }

  async findOne(id: number): Promise<Favorites> {
    const favorite = await this.favoriteRepository.findOne({ where: { id } });
    if (!favorite) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }
    return favorite;
  }

  async remove(id: number, userId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with ID ${id} not found`);
    }

    await this.favoriteRepository.remove(favorite);
  }

  async removeByBookId(bookId: number, userId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { book_id: bookId, user_id: userId },
    });

    if (!favorite) {
      throw new NotFoundException(`Book with ID ${bookId} is not in favorites`);
    }

    await this.favoriteRepository.remove(favorite);
  }

  async isBookFavorited(bookId: number, userId: number): Promise<boolean> {
    const favorite = await this.favoriteRepository.findOne({
      where: { book_id: bookId, user_id: userId },
    });
    return !!favorite;
  }
} 