import { MigrationInterface, QueryRunner } from "typeorm";

export class AgregarNombre11AEntidadDefinicion1727827588909 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                ALTER TABLE "entidad_definicion" ADD "nombre_11" VARCHAR(255);
                UPDATE entidad_definicion SET nombre_11 = 'valor_nombre_11' WHERE id = 9;
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                ALTER TABLE "entidad_definicion" DROP COLUMN "nombre_11";
            `,
        )
    }

}
