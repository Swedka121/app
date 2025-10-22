import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from './schema/UserSchema';
import { Model } from 'mongoose';
import { UserDto } from './dto/UserDto';
import { RoleT } from 'src/types/roleType';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  async create(userDto: UserDto): Promise<UserModel> {
    const user_inst: unknown = new this.user(userDto);
    console.log((user_inst as UserModel).avatar);
    return await (user_inst as UserModel)
      .save()
      .catch((err: { code: number; name: string }) => {
        throw err && err.code == 11000
          ? new BadRequestException(
              `Duplicate email or username! Try another google account! ${JSON.stringify(err)}`,
            )
          : new Error(String(err.code));
      });
  }

  async findByGoogleId(googleId: string): Promise<UserModel | null> {
    return await this.user.findOne({ googleId });
  }
  async getAllUsers() {
    return await this.user.find();
  }
  async addRole(userGoogleId: string, role: RoleT) {
    const user = await this.findByGoogleId(userGoogleId);
    if (!user)
      throw new BadRequestException('user with this google id is undefined');

    if (!user.roles.includes(role)) user.roles.push(role);

    return await user.save();
  }
  async deleteRole(userGoogleId: string, role: RoleT) {
    const user = await this.findByGoogleId(userGoogleId);
    if (!user)
      throw new BadRequestException('user with this google id is undefined');

    const index = user.roles.findIndex((a) => a == role);
    if (index >= 0) user.roles = user.roles.filter((a) => a != role);

    return await user.save();
  }
  async deleteUser(userGoogleId: string) {
    return await this.user.findOneAndDelete({ googleId: userGoogleId });
  }
}
