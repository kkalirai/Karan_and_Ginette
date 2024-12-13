// role.model.ts
import { Optional, DataTypes } from 'sequelize';
import {
  Table,
  Column,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
  Model,
  DataType,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import {
  RoleAttributes,
  UserRoleAttributes,
} from '../interfaces/role.interface';
import { User } from './user.model';
import { RoleENUM } from 'src/common/enum/userRole.enum';

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

@Table
export class Role extends Model<RoleAttributes, RoleCreationAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
  })
  id: number;

  @Column({
    type: DataTypes.ENUM(
      RoleENUM.admin,
      RoleENUM.user,
      RoleENUM.instructor,
      RoleENUM.superadmin,
    ),
  })
  role: RoleENUM;

  @HasMany(() => UserRole)
  userRoles: UserRole[];
}

interface UserRoleCreationAttributes
  extends Optional<UserRoleAttributes, 'id'> {}

@Table
export class UserRole extends Model<
  UserRoleAttributes,
  UserRoleCreationAttributes
> {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT, // Assuming `id` in User model is of type BIGINT
    allowNull: false,
  })
  userID: number;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.BIGINT, // Assuming `id` in User model is of type BIGINT
    allowNull: false,
  })
  roleID: number;

  @BelongsTo(() => Role)
  role: Role;

  @BelongsTo(() => User)
  user: User;
}
