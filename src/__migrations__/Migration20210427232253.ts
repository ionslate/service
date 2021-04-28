import { Migration } from '@mikro-orm/migrations';

export class Migration20210427232253 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "weapon_mode" ("id" varchar(255) not null, "name" varchar(255) not null, "range__8" varchar(255) null, "range__16" varchar(255) null, "range__24" varchar(255) null, "range__32" varchar(255) null, "range__40" varchar(255) null, "range__48" varchar(255) null, "range__96" varchar(255) null, "damage" varchar(255) null, "burst" varchar(255) null, "saving_attribute" varchar(255) null, "weapon_id" varchar(255) not null);');
    this.addSql('alter table "weapon_mode" add constraint "weapon_mode_pkey" primary key ("id");');
    this.addSql('alter table "weapon_mode" add constraint "weapon_mode_name_unique" unique ("name");');

    this.addSql('create table "weapon_mode_ammo" ("id" serial primary key, "weapon_mode_entity_id" varchar(255) not null, "ammo_entity_id" varchar(255) not null);');

    this.addSql('create table "weapon_mode_traits" ("weapon_mode_entity_id" varchar(255) not null, "rule_entity_id" varchar(255) not null);');
    this.addSql('alter table "weapon_mode_traits" add constraint "weapon_mode_traits_pkey" primary key ("weapon_mode_entity_id", "rule_entity_id");');

    this.addSql('alter table "weapon_mode" add constraint "weapon_mode_weapon_id_foreign" foreign key ("weapon_id") references "ammo" ("id") on update cascade;');

    this.addSql('alter table "weapon_mode_ammo" add constraint "weapon_mode_ammo_weapon_mode_entity_id_foreign" foreign key ("weapon_mode_entity_id") references "weapon_mode" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "weapon_mode_ammo" add constraint "weapon_mode_ammo_ammo_entity_id_foreign" foreign key ("ammo_entity_id") references "ammo" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "weapon_mode_traits" add constraint "weapon_mode_traits_weapon_mode_entity_id_foreign" foreign key ("weapon_mode_entity_id") references "weapon_mode" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "weapon_mode_traits" add constraint "weapon_mode_traits_rule_entity_id_foreign" foreign key ("rule_entity_id") references "rule" ("id") on update cascade on delete cascade;');
  }

}
