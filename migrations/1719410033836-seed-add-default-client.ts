import { randomUUID } from 'node:crypto';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { ClientEntity } from '@/clients/clients.entity';

export class SeedAddDefaultClient1719410033836 implements MigrationInterface {
  private readonly clientId = randomUUID();

  public async up(queryRunner: QueryRunner): Promise<void> {
    const name = 'Comprador Avulso';
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into(ClientEntity, ['id', 'name'])
      .values({ id: this.clientId, name })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(ClientEntity)
      .where({ id: this.clientId })
      .execute();
  }
}
