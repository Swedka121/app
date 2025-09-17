import { User } from 'src/user/schema/UserSchema';
import { BlogContentNode } from '../schemas/blog.schema';

export class BlogDto {
  title: string;
  description: string;
  avatar: string;
  content: BlogContentNode[];
  comments: string[];
  author: User;
  id: string;
  constructor(
    title: string,
    description: string,
    content: BlogContentNode[],
    comments: string[],
    author: User,
    avatar?: string,
    id?: string,
  ) {
    this.title = title;
    this.description = description;
    this.avatar = avatar || 'default';
    this.content = content;
    this.comments = comments;
    this.author = author;
    this.id = id || '';
  }
  hasId() {
    return this.id !== '';
  }
}
