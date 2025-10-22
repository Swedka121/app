import { RoleT } from 'src/types/roleType';

export class UserDto {
  id: string;
  username: string;
  email: string;
  googleId: string;
  roles: RoleT[];
  avatar: string;
  constructor(
    username: string,
    email: string,
    googleId: string,
    roles: RoleT[],
    id?: string,
    avatar?: string,
  ) {
    this.id = id ? id : 'none';
    this.username = username;
    this.email = email;
    this.googleId = googleId;
    this.roles = roles;
    this.avatar = avatar ? avatar : 'default';
  }
}
