import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reviews } from './reviews.entity';
import { CreateReviewDto } from './create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Reviews)
    private reviewRepository: Repository<Reviews>,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: number): Promise<Reviews> {
    try {
      const review = this.reviewRepository.create({
        ...createReviewDto,
        user_id: userId,
      });
      console.log('Attempting to save review:', review); // Debug log
      return await this.reviewRepository.save(review);
    } catch (error) {
      console.error('Error creating review:', error); // Error log
      throw new InternalServerErrorException('Failed to create review: ' + error.message);
    }
  }

  async findAll(): Promise<Reviews[]> {
    return await this.reviewRepository.find();
  }

  async findByBookId(bookId: number): Promise<Reviews[]> {
    return await this.reviewRepository.find({ where: { book_id: bookId } });
  }

  async findOne(id: number): Promise<Reviews> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: number, updateReviewDto: CreateReviewDto): Promise<Reviews> {
    const review = await this.findOne(id);
    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async remove(id: number): Promise<void> {
    const result = await this.reviewRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
  }
} 