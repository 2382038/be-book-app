import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFavoritesTable1746021359391 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE favorites (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL,
                book_id INTEGER NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT now(),
                updated_at TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT fk_user
                    FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_book
                    FOREIGN KEY (book_id)
                    REFERENCES books(id)
                    ON DELETE CASCADE,
                CONSTRAINT unique_user_book
                    UNIQUE (user_id, book_id)
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE favorites;`);
    }

}
