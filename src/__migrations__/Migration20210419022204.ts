import { Migration } from '@mikro-orm/migrations';

export class Migration20210419022204 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "hacking_program" ("id" varchar(255) not null, "name" varchar(255) not null, "link" varchar(255) null, "attack_mod" varchar(255) null, "opponent_mod" varchar(255) null, "damage" varchar(255) null, "burst" varchar(255) null, "target" text[] not null, "skill_type" text[] not null, "special" varchar(255) null);');
    this.addSql('alter table "hacking_program" add constraint "hacking_program_pkey" primary key ("id");');

    this.addSql('create table "hacking_device" ("id" varchar(255) not null, "name" varchar(255) not null, "link" varchar(255) null);');
    this.addSql('alter table "hacking_device" add constraint "hacking_device_pkey" primary key ("id");');

    this.addSql('create table "hacking_device_programs" ("hacking_device_entity_id" varchar(255) not null, "hacking_program_entity_id" varchar(255) not null);');
    this.addSql('alter table "hacking_device_programs" add constraint "hacking_device_programs_pkey" primary key ("hacking_device_entity_id", "hacking_program_entity_id");');

    this.addSql('alter table "hacking_device_programs" add constraint "hacking_device_programs_hacking_device_entity_id_foreign" foreign key ("hacking_device_entity_id") references "hacking_device" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "hacking_device_programs" add constraint "hacking_device_programs_hacking_program_entity_id_foreign" foreign key ("hacking_program_entity_id") references "hacking_program" ("id") on update cascade on delete cascade;');
  }

}
