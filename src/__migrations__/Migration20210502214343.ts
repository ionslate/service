import { Migration } from '@mikro-orm/migrations';

export class Migration20210502214343 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "app_user" ("id" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) null, "email" varchar(255) not null, "roles" text[] not null default \'{USER}\', "active" bool not null default true, "reset_reset_id" varchar(255) null, "reset_reset_expiration" int4 null);');
    this.addSql('alter table "app_user" add constraint "app_user_pkey" primary key ("id");');
    this.addSql('create index "app_user_username_index" on "app_user" ("username");');
    this.addSql('alter table "app_user" add constraint "app_user_username_unique" unique ("username");');
    this.addSql('create index "app_user_email_index" on "app_user" ("email");');
    this.addSql('alter table "app_user" add constraint "app_user_email_unique" unique ("email");');
    this.addSql('create index "app_user_reset_reset_id_index" on "app_user" ("reset_reset_id");');

    this.addSql('create index "app_user_id_active_index" on "app_user" ("id", "active");');
    this.addSql('create index "app_user_username_active_index" on "app_user" ("username", "active");');
    this.addSql('create index "app_user_email_active_index" on "app_user" ("email", "active");');
  }

}
