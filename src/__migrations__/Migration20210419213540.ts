import { Migration } from '@mikro-orm/migrations';

export class Migration20210419213540 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "rule" drop constraint if exists "rule_type_check";');
    this.addSql('alter table "rule" alter column "type" type varchar(255) using ("type"::varchar(255));');
  }

}
