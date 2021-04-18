import { Migration } from '@mikro-orm/migrations';

export class Migration20210418012300 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "rule" drop constraint if exists "rule_link_check";');
    this.addSql('alter table "rule" alter column "link" type varchar(255) using ("link"::varchar(255));');
    this.addSql('alter table "rule" alter column "link" drop not null;');
  }

}
