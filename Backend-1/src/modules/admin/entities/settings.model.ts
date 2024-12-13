import { Optional } from 'sequelize';
import { settingInterface } from '../interfaces/settings.interface';
import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

interface SettingCreationAttributes extends Optional<settingInterface, 'id'> {}

@Table
export class setting extends Model<
  settingInterface,
  SettingCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    unique: true,
  })
  id: number;

  @Column({
    unique: true,
  })
  moduleName: string;

  @Column
  data: string;
}
