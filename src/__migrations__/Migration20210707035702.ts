import { Migration } from '@mikro-orm/migrations';

export class Migration20210707035702 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "audit" add column "resource_id" varchar(255) not null;');
  }

}
