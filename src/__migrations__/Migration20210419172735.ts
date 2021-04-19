import { Migration } from '@mikro-orm/migrations';

export class Migration20210419172735 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "hacking_program" add constraint "hacking_program_name_unique" unique ("name");');

    this.addSql('alter table "hacking_device" add constraint "hacking_device_name_unique" unique ("name");');

    this.addSql('alter table "ammo" add constraint "ammo_name_unique" unique ("name");');

    this.addSql('alter table "rule" add constraint "rule_name_unique" unique ("name");');
  }

}
