import { MigrationInterface, QueryRunner } from "typeorm";

export class NewColumn1716316313673 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            alter table apremio add column nueva_fecha date;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            alter table apremio drop column nueva_fecha;
        `);
    }

}
