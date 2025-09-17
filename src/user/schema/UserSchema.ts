import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoleT } from 'src/types/roleType';

export type UserModel = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  googleId: string;

  @Prop({
    enum: ['user', 'admin', 'manager'],
    required: true,
    type: [String],
  })
  roles: RoleT[];

  @Prop({ required: true })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
