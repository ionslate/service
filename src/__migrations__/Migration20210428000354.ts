import { Migration } from '@mikro-orm/migrations';

export class Migration20210428000354 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "weapon" ("id" varchar(255) not null, "name" varchar(255) not null, "link" varchar(255) null);');
    this.addSql('alter table "weapon" add constraint "weapon_pkey" primary key ("id");');
    this.addSql('alter table "weapon" add constraint "weapon_name_unique" unique ("name");');

    this.addSql('alter table "weapon_mode" drop constraint "weapon_mode_weapon_id_foreign";');
    this.addSql('alter table "weapon_mode" add constraint "weapon_mode_weapon_id_foreign" foreign key ("weapon_id") references "weapon" ("id") on update cascade;');
  }

}
