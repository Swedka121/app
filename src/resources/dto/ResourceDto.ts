import { User } from 'src/user/schema/UserSchema';

export class ResourceDto {
  mimeType: string;
  path: string;
  url: string;
  creationDate: Date;
  author: User;
  real_name: string;

  constructor(
    mimeType: string,
    path: string,
    url: string,
    creationDate: Date,
    author: User,
    real_name: string,
  ) {
    this.mimeType = mimeType;
    this.path = path;
    this.url = url;
    this.creationDate = creationDate ?? new Date();
    this.author = author;
    this.real_name = real_name;
  }
}
