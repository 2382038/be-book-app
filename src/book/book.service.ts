import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Books } from './books.entity';
import { CreateBookDto } from './create-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Books)
    private bookRepository: Repository<Books>,
  ) {}

  async create(createBookDto: CreateBookDto, userId: number): Promise<Books> {
    try {
      const book = this.bookRepository.create({
        ...createBookDto,
        user_id: userId,
      });
      console.log('Attempting to save book:', book); // Debug log
      return await this.bookRepository.save(book);
    } catch (error) {
      console.error('Error creating book:', error); // Error log
      throw new InternalServerErrorException('Failed to create book: ' + error.message);
    }
  }

  async findAll(): Promise<Books[]> {
    return await this.bookRepository.find();
  }

  async findOne(id: number): Promise<Books> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: CreateBookDto): Promise<Books> {
    const book = await this.findOne(id);
    Object.assign(book, updateBookDto);
    return await this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
  }
} 