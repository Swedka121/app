import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Blog } from './schemas/blog.schema';
import { BlogDto } from './dto/blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blog: Model<Blog>) {}

  async create(blogDto: BlogDto) {
    const blog = new this.blog(blogDto);

    return await blog.save().catch((err: { code: number; name: string }) => {
      if (err.code == 11000)
        throw new BadRequestException('Duplicate error!' + JSON.stringify(err));
      else throw err;
    });
  }
  async update(blogDto: BlogDto) {
    return await this.blog
      .findOneAndUpdate({ title: blogDto.title })
      .catch((err: { code: number; name: string }) => {
        if (err.code == 11000)
          throw new BadRequestException('Duplicate error!');
        else throw err;
      });
  }
  async updateAndCheckAuthor(blogDto: BlogDto, authorGoogleId: string) {
    const blog = await this.blog.findById(blogDto.id);
    if (!blog) throw new BadRequestException('Blog with this id is unedfined!');

    if (blog.author.googleId != authorGoogleId)
      throw new ForbiddenException('You are not allowed to delete this blog!');

    return (await blog
      .updateOne(blogDto)
      .catch((err: { code: number; name: string }) => {
        if (err.code == 11000)
          throw new BadRequestException('Duplicate error!');
        else throw err;
      })) as Blog;
  }
  async delete(blogId: string) {
    return await this.blog.findByIdAndDelete(blogId);
  }
  async deleteAndCheckAuthor(blogId: string, authorGoogleId: string) {
    const blog = await this.blog.findById(blogId);
    if (!blog)
      throw new BadRequestException('Blog with this id is une3dfined!');

    if (blog.author.googleId != authorGoogleId)
      throw new ForbiddenException('You are not allowed to delete this blog!');

    return await blog.deleteOne();
  }
  async getAll() {
    return (await this.blog.find()).map((el) => ({
      ...el,
      content: null,
      comments: el.comments.length,
    }));
  }
  async getById(blogId: string) {
    return await this.blog.findById(blogId);
  }
}
