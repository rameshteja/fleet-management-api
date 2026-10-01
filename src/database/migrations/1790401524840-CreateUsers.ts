import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1790401524840 implements MigrationInterface {
  name = 'CreateUsers1790401524840';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_gender_enum" AS ENUM('MALE', 'FEMALE', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('PENDING', 'ACTIVE', 'INACTIVE', 'DECLINED', 'TEMPORARY_BLOCKED', 'PERMANENT_BLOCKED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "user_name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying(255) NOT NULL, "gender" "public"."users_gender_enum", "phone_number" character varying(20) NOT NULL, "dob" date, "profile_image" character varying(500), "group_id" uuid NOT NULL, "is_email_verified" boolean NOT NULL DEFAULT false, "is_mobile_verified" boolean NOT NULL DEFAULT false, "address" text, "city" character varying(100), "state_id" uuid, "country_id" uuid, "created_by" uuid, "updated_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "last_access_at" TIMESTAMP WITH TIME ZONE, "status" "public"."users_status_enum" NOT NULL DEFAULT 'PENDING', "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_074a1f262efaca6aba16f7ed920" UNIQUE ("user_name"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
  }
}
