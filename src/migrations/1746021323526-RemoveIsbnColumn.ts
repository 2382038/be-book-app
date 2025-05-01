import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveIsbnColumn1746021323526 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // First drop the unique constraint
        await queryRunner.query(`ALTER TABLE books DROP CONSTRAINT IF EXISTS unique_isbn;`);
        
        // Then drop the isbn column
        await queryRunner.query(`ALTER TABLE books DROP COLUMN IF EXISTS isbn;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add back the isbn column
        await queryRunner.query(`ALTER TABLE books ADD COLUMN isbn VARCHAR(13);`);
        
        // Add back the unique constraint
        await queryRunner.query(`ALTER TABLE books ADD CONSTRAINT unique_isbn UNIQUE (isbn);`);
    }
} 