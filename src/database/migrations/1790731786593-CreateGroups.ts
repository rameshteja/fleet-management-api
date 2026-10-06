import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreateGroups1790731786593 implements MigrationInterface {
  name = 'CreateGroups1790731786593';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."groups_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "code" character varying(100) NOT NULL, "description" text, "status" "public"."groups_status_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_8989cafa0945a366f0c8716e609" UNIQUE ("code"), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`,
    );

    await queryRunner.createIndex(
      'groups',
      new TableIndex({
        name: 'IDX_groups_code',
        columnNames: ['code'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('groups', 'IDX_groups_code');
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TYPE "public"."groups_status_enum"`);
  }
}
