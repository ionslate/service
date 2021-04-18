import { Migration } from '@mikro-orm/migrations';

export class Migration20210418010049 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "rule" ("id" varchar(255) not null, "name" varchar(255) not null, "link" varchar(255) not null);');
    this.addSql('alter table "rule" add constraint "rule_pkey" primary key ("id");');
  }

}
