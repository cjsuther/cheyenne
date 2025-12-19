import { MigrationInterface, QueryRunner } from "typeorm";

export class CrearTablaTipoEnditdad1728133670864 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE tipo_entidad (
                    id SERIAL PRIMARY KEY,
                    nombre VARCHAR(100) NOT NULL,
                    descripcion TEXT,
                    activo BOOLEAN DEFAULT TRUE,
                    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );

                ALTER TABLE ENTIDAD_DEFINICION ADD COLUMN tipo_entidad_id INTEGER;

                ALTER TABLE ENTIDAD_DEFINICION ADD CONSTRAINT fk_tipo_entidad
                    FOREIGN KEY (tipo_entidad_id)
                    REFERENCES tipo_entidad(id);
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                ALTER TABLE ENTIDAD_DEFINICION DROP CONSTRAINT fk_tipo_entidad;

                ALTER TABLE ENTIDAD_DEFINICION DROP COLUMN tipo_entidad_id;

                DROP TABLE tipo_entidad;
            `,
        )
    }

}
