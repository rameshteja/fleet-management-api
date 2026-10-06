import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class AddUserGroupForeignKey1790735872479 implements MigrationInterface {
  name = 'AddUserGroupForeignKey1790735872479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersTable = await queryRunner.getTable('users');

    if (!usersTable) {
      throw new Error('users table does not exist.');
    }

    // Sanitize any existing user records that have an invalid or orphaned group_id
    const orphanUsers = (await queryRunner.query(
      `SELECT "id" FROM "users" WHERE "group_id" NOT IN (SELECT "id" FROM "groups")`,
    )) as Array<{ id: string }>;

    if (orphanUsers.length > 0) {
      const superAdminGroup = (await queryRunner.query(
        `SELECT "id" FROM "groups" WHERE "code" = 'SUPER_ADMIN' LIMIT 1`,
      )) as Array<{ id: string }>;
      let targetGroupId = superAdminGroup[0]?.id;

      if (!targetGroupId) {
        const anyGroup = (await queryRunner.query(
          `SELECT "id" FROM "groups" LIMIT 1`,
        )) as Array<{ id: string }>;
        targetGroupId = anyGroup[0]?.id;
      }

      if (targetGroupId) {
        await queryRunner.query(
          `UPDATE "users" SET "group_id" = $1 WHERE "group_id" NOT IN (SELECT "id" FROM "groups")`,
          [targetGroupId],
        );
      }
    }

    const existingForeignKey = usersTable.foreignKeys.find(
      (fk) =>
        fk.columnNames.includes('group_id') &&
        fk.referencedTableName === 'groups',
    );

    if (!existingForeignKey) {
      await queryRunner.createForeignKey(
        'users',

        new TableForeignKey({
          name: 'FK_users_group',
          columnNames: ['group_id'],
          referencedTableName: 'groups',
          referencedColumnNames: ['id'],
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        }),
      );
    }

    const existingIndex = usersTable.indices.find(
      (index) =>
        index.columnNames.length === 1 && index.columnNames[0] === 'group_id',
    );

    if (!existingIndex) {
      await queryRunner.createIndex(
        'users',

        new TableIndex({
          name: 'IDX_users_group_id',
          columnNames: ['group_id'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');

    if (!table) {
      return;
    }

    const foreignKey = table.foreignKeys.find(
      (fk) => fk.name === 'FK_users_group',
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey('users', foreignKey);
    }

    const index = table.indices.find(
      (idx) => idx.name === 'IDX_users_group_id',
    );

    if (index) {
      await queryRunner.dropIndex('users', index);
    }
  }
}
