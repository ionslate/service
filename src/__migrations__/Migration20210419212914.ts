import { Migration } from '@mikro-orm/migrations';

export class Migration20210419212914 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "rule" add column "type" int2 null;');
  }

}
