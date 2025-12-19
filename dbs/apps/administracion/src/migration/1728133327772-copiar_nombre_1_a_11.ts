import { MigrationInterface, QueryRunner } from "typeorm";

export class CopiarNombre1A111728133327772 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
                UPDATE entidad_definicion SET nombre_11 = nombre_1 where nombre_11 IS NULL;
            `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      /*
                No se puede hacer un rollback porque no se puede asegurar que el campo nombre_11
                haya sido modificado por esta migración.
            */
      `
                UPDATE entidad_definicion SET nombre_11 = NULL;
            `
    );
  }
}
