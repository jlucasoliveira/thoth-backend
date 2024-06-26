import bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { UserEntity } from '@/users/users.entity';

export class SeedAddAdminUser1719408577678 implements MigrationInterface {
  private readonly userId = randomUUID();

  public async up(queryRunner: QueryRunner): Promise<void> {
    const username = 'admin';
    const password = await bcrypt.hash(process.env.DEFAULT_ADMIN_USER, 10);

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(UserEntity, ['id', 'username', 'password', 'name', 'isAdmin'])
      .values({
        username,
        password,
        isAdmin: true,
        name: username,
        id: this.userId,
      })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where({ id: this.userId })
      .execute();
  }
}
