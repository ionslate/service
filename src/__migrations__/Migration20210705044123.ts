import { Migration } from '@mikro-orm/migrations';

export class Migration20210705044123 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "audit" ("id" serial primary key, "user_id" varchar(255) null, "created_at" timestamptz(0) not null, "data" jsonb not null);');

    this.addSql('alter table "audit" add constraint "audit_user_id_foreign" foreign key ("user_id") references "app_user" ("id") on update cascade on delete set null;');
  }

}
