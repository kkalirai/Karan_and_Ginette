import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { User } from 'src/modules/auth/entities/user.model';
import { Op, Sequelize, QueryTypes } from 'sequelize';
import { Role, UserRole } from 'src/modules/auth/entities/role.model';
import { PasswordService } from 'src/modules/auth/services/password.services';
import { EmailService } from 'src/providers/email/email.service';
import { IPayloadUserJWT } from 'src/common/interfaces/interfaces';
import { Parser } from '@json2csv/plainjs';

@Injectable()
export class UserManagementService {
  constructor(
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
    @Inject('USER_REPOSITORY') private userRepo: typeof User,
    private passwordService: PasswordService,
    private emailService: EmailService,
    @Inject('USERROLE_REPOSITORY') private userRoleRepo: typeof UserRole,
    @Inject('ROLE_REPOSITORY') private roleRepo: typeof Role,
  ) {}

  async getUserDetailById(userID) {
    try {
      const user = await this.userRepo.findByPk(userID, {
        attributes: [
          'id',
          'firstName',
          'lastName',
          'email',
          'isActive',
          'isVerified',
          'height',
          'weight',
        ],
        raw: true,
      });
      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
      }

      const userRole = await this.userRoleRepo.findOne({
        where: {
          userID: user.id,
        },
      });

      const role = (await this.roleRepo.findByPk(userRole.roleID)).role;
      user['role'] = role;

      return {
        message: 'Fetched User',
        status: false,
        code: HttpStatus.OK,
        data: user,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers(
    pageNumber: number,
    pageLength: number,
    sortKey: string,
    sortOrder: string,
    searchKey: string,
  ) {
    try {
      const data = await this.userRoleRepo.findAll({
        where: {
          roleID: 3,
        },
        attributes: ['userID'],
        raw: true,
      });
      const userIDs = data.map((user) => user.userID);

      pageNumber = Math.max(1, Math.floor(pageNumber));
      pageLength = Math.max(1, Math.floor(pageLength));
      const offset = (pageNumber - 1) * pageLength;
      const maxPageNumber = Math.ceil(
        (await this.userRepo.count({
          where: {
            id: userIDs,
          },
        })) / pageLength,
      );

      if (pageNumber !== 1 && pageNumber > maxPageNumber) {
        throw new HttpException('Invalid Page Number.', HttpStatus.BAD_REQUEST);
      }
      const order: any = [
        [sortKey, sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC'],
      ];
      let whereCondition;
      if (searchKey) {
        whereCondition = {
          [Op.or]: [
            { firstName: { [Op.like]: `%${searchKey}%` } },
            { lastName: { [Op.like]: `%${searchKey}%` } },
            { email: { [Op.like]: `%${searchKey}%` } },
          ],
          id: userIDs,
        };
      } else {
        whereCondition = {
          id: userIDs,
        };
      }

      const usersLength = await this.userRepo.count({
        where: whereCondition,
      });

      const users = await this.userRepo.findAll({
        where: whereCondition,
        limit: pageLength,
        offset: offset,
        order: order,
        attributes: ['id', 'firstName', 'lastName', 'email', 'isActive'],
        raw: true,
      });

      return {
        code: HttpStatus.OK,
        status: true,
        message: 'Fetched Users Successfully',
        data: {
          result: users,
          total: Math.max(usersLength, users.length),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllInstructors(
    pageNumber: number,
    pageLength: number,
    sortKey: string,
    sortOrder: string,
    searchKey: string,
  ) {
    try {
      const data = await this.userRoleRepo.findAll({
        where: {
          roleID: 4,
        },
        attributes: ['userID'],
        raw: true,
      });
      const userIDs = data.map((user) => user.userID);

      pageNumber = Math.max(1, Math.floor(pageNumber));
      pageLength = Math.max(1, Math.floor(pageLength));
      const offset = (pageNumber - 1) * pageLength;
      const maxPageNumber = Math.ceil(
        (await this.userRepo.count({
          where: {
            id: userIDs,
          },
        })) / pageLength,
      );

      if (pageNumber !== 1 && pageNumber > maxPageNumber) {
        throw new HttpException('Invalid Page Number.', HttpStatus.BAD_REQUEST);
      }
      const order: any = [
        [sortKey, sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC'],
      ];
      let whereCondition;
      if (searchKey) {
        whereCondition = {
          [Op.or]: [
            { firstName: { [Op.like]: `%${searchKey}%` } },
            { lastName: { [Op.like]: `%${searchKey}%` } },
            { email: { [Op.like]: `%${searchKey}%` } },
          ],
          id: userIDs,
        };
      } else {
        whereCondition = {
          id: userIDs,
        };
      }
      const usersLength = await this.userRepo.count({
        where: whereCondition,
      });

      const users = await this.userRepo.findAll({
        where: whereCondition,
        limit: pageLength,
        offset: offset,
        order: order,
        attributes: ['id', 'firstName', 'lastName', 'email', 'isActive'],
        raw: true,
      });
      return {
        code: HttpStatus.OK,
        status: true,
        message: 'Fetched Instructors Successfully',
        data: {
          result: users,
          total: Math.max(usersLength, users.length),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllAdmins(
    pageNumber: number,
    pageLength: number,
    sortKey: string,
    sortOrder: string,
    searchKey: string,
    role: number,
  ) {
    try {
      const data = await this.userRoleRepo.findAll({
        where: {
          roleID: 2,
        },
        attributes: ['userID'],
        raw: true,
      });
      console.log(pageNumber, pageLength);

      const userIDs = data.map((user) => user.userID);

      pageNumber = Math.max(1, Math.floor(pageNumber));
      pageLength = Math.max(1, Math.floor(pageLength));
      const offset = (pageNumber - 1) * pageLength;

      const maxPageNumber = Math.ceil(
        (await this.userRepo.count({
          where: {
            id: userIDs,
          },
        })) / pageLength,
      );

      console.log(offset, pageLength);

      if (pageNumber > maxPageNumber && pageNumber !== 1) {
        throw new HttpException('Invalid Page Number.', HttpStatus.BAD_REQUEST);
      }

      let usersLength: number, users: any;

      if (searchKey) {
        const data = await this.sequelize.query(
          `
                    select * from Users where id in (
                    select userID from UserRoles where roleID= :role
                    ) and firstName LIKE :keyword or lastName LIKE :keyword or email LIKE :keyword;`,
          {
            replacements: {
              keyword: searchKey,
              role,
            },
            type: QueryTypes.SELECT,
          },
        );
        usersLength = data.length;

        users = await this.sequelize.query(
          `
                select * from Users where id in (
                select userID from UserRoles where roleID= :role
                ) and firstName LIKE :keyword or lastName LIKE :keyword or email LIKE :keyword
                order by ${sortKey} ${sortOrder.toUpperCase()}
                limit :limit
                offset :offset ;`,
          {
            replacements: {
              keyword: `%${searchKey}%`,
              limit: pageLength,
              role,
              offset: offset,
            },
            type: QueryTypes.SELECT,
          },
        );
        console.log(
          '🚀 ~ UserManagementService ~ getAllAdmins ~ users:',
          users,
        );
      } else {
        usersLength = await this.userRepo.count({
          where: {
            id: userIDs,
          },
        });

        users = await this.sequelize.query(
          `
                select * from Users where id in (
                select userID from UserRoles where roleID= :role
                ) order by ${sortKey} ${sortOrder.toUpperCase()}
                limit :limit
                offset :offset ;`,
          {
            replacements: {
              limit: pageLength,
              offset: offset,
              role,
            },
            type: QueryTypes.SELECT,
          },
        );
      }
      return {
        code: HttpStatus.OK,
        status: true,
        message: 'Fetched Admins Successfully',
        data: {
          result: users,
          total: Math.max(usersLength, users.length),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async UpdateUser(userId, updateUserData) {
    const user = await this.userRepo.findByPk(userId);
    if (!user) {
      throw new HttpException('Invalid UserID', HttpStatus.NOT_FOUND);
    }

    user.firstName = updateUserData.firstName;
    user.lastName = updateUserData.lastName;
    user.gender = updateUserData.gender;
    await user.save();

    return {
      message: 'Updated User Successfully',
      status: true,
      code: HttpStatus.OK,
    };
  }

  async deleteUser(userId) {
    try {
      const user = await this.userRepo.findByPk(userId);
      if (!user) {
        throw new HttpException(
          'Invalid URL or Invalid UserID',
          HttpStatus.NOT_FOUND,
        );
      }

      const isAdmin = await this.userRoleRepo.findOne({
        where: {
          userID: userId,
        },
      });
      if (!isAdmin || isAdmin.roleID !== 2) {
        throw new HttpException('Invalid userID', HttpStatus.BAD_REQUEST);
      }

      await user.destroy();
      await isAdmin.destroy();

      return {
        status: true,
        code: false,
        message: 'Deleted',
      };
    } catch (error) {
      throw error;
    }
  }

  async ChangeUserActivityStatus(userID) {
    try {
      const user = await this.userRepo.findByPk(userID);
      if (!user) {
        throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
      }

      const isAdmin = await this.userRoleRepo.findOne({
        where: {
          userID: userID,
        },
      });
      if (!isAdmin || isAdmin.roleID !== 2) {
        throw new HttpException('Invalid userID', HttpStatus.BAD_REQUEST);
      }

      if (user.isActive) {
        user.isActive = false;
      } else {
        user.isActive = true;
      }
      await user.save();

      return {
        message: 'Updated',
        status: true,
        code: HttpStatus.OK,
      };
    } catch (error) {
      throw error;
    }
  }

  async createNewAdmin(payload) {
    try {
      if (!payload.email) {
        throw new HttpException(
          'Email or contact is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      let emailExistOrNotIn;
      if (payload.email) {
        emailExistOrNotIn = await this.userRepo.findOne({
          where: {
            email: payload.email,
          },
        });
      }

      if (emailExistOrNotIn && payload.email) {
        throw new HttpException('Email already exists', HttpStatus.CONFLICT);
      }

      const hashedPassword =
        await this.passwordService.encryptPassword('123456');
      const newUser = await this.userRepo.create({
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        password: hashedPassword,
        isVerified: true,
        gender: payload.gender,
      });

      await this.userRoleRepo.create({
        userID: newUser.id,
        roleID: payload.role,
      });

      const jwtPayload: IPayloadUserJWT = {
        userID: newUser.id,
      };
      const token = await this.passwordService.generateAccessToken(jwtPayload);

      const passwordMessage = `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Fitness App</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);">
              <h2 style="text-align: center; color: #333;">Welcome to Fitness App!</h2>
              <p style="text-align: center; color: #555; font-size: 18px;">You're registered on Fitness App.</p>
              <p style="text-align: center; color: #555;">You can set your password by clicking on the button below:</p>
              <div style="text-align: center; margin-bottom: 20px;">
                <a href="${process.env.FRONTENDHOST}/reset-password?token=${token}" style="display: inline-block; padding: 12px 20px; font-size: 16px; background-color: #007bff; color: #fff; border-radius: 5px; text-decoration: none;">Reset Password</a>
              </div>
              <p style="text-align: center; color: #555;">If you didn't request this, you can ignore this email.</p>
              <p style="text-align: center; color: #555;">Best regards,<br>Fitness Team</p>
            </div>
            
            </body>
            </html>
            
            `;

      await this.emailService.sendMail(
        newUser.email,
        passwordMessage,
        'Generate Your Password',
      );

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Admin Created',
      };
    } catch (error) {
      throw error;
    }
  }
  public async changeActiveStatus(userID) {
    try {
      const user = await this.userRepo.findByPk(userID);
      if (!user) {
        throw new HttpException('Invalid UserID', HttpStatus.BAD_REQUEST);
      }

      if (user.isActive) {
        user.isActive = false;
      } else {
        user.isActive = true;
      }

      await user.save();
      return {
        message: 'Status Updated',
        code: HttpStatus.OK,
        status: true,
      };
    } catch (error) {
      throw error;
    }
  }

  public async getCSVData() {
    try {
      const adminData = await this.sequelize.query(`
                select firstName, lastName, email, contact, gender, isActive from Users where id in 
                (select userID from UserRoles where roleID=2)`);
      const parser = new Parser();
      console.log(adminData);

      const csv = parser.parse(adminData);

      return csv;
    } catch (error) {
      console.error('Error creating Workbook:', error);
    }
  }

  public async getUserCSVData() {
    try {
      const adminData = await this.sequelize.query(`
                select firstName, lastName, email, contact, gender, isActive from Users where id in 
                (select userID from UserRoles where roleID=3)`);
      const parser = new Parser();
      console.log(adminData);

      const csv = parser.parse(adminData);

      return csv;
    } catch (error) {
      console.error('Error creating Workbook:', error);
    }
  }
}
