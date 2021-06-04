import { Migration } from '@mikro-orm/migrations';

export class Migration20210604002837 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "audit" ("id" varchar(255) not null, "user_id" varchar(255) null, "created_at" date not null, "data" jsonb not null);');
    this.addSql('alter table "audit" add constraint "audit_pkey" primary key ("id");');

    this.addSql('alter table "audit" add constraint "audit_user_id_foreign" foreign key ("user_id") references "app_user" ("id") on update cascade on delete set null;');
  }

}
