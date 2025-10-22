import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Resource, ResourceModel } from './schema/resourceSchema';
import { Model } from 'mongoose';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';
import { ReadableStream as NodeReadableStream } from 'node:stream/web';
import { User } from 'src/user/schema/UserSchema';

@Injectable()
export class ResourcesService {
  constructor(@InjectModel(Resource.name) private resource: Model<Resource>) {}

  async loadFromUrl(url: string) {
    // 1️⃣ Get mime type from HEAD request
    const { mimeType, filename } = await fetch(url, { method: 'HEAD' })
      .then((res) => {
        const disposition = res.headers.get('Content-Disposition');
        let fileName = 'file-' + new Date().toISOString();

        if (disposition && disposition.includes('filename=')) {
          const match = disposition.match(/filename="?([^"]+)"?/);
          if (match) fileName = match[1];
        }

        return {
          mimeType: res.headers.get('content-type') as string,
          filename: fileName || 'resource',
        };
      })
      .catch(() => ({ mimeType: null, filename: 'resource' }));

    if (!mimeType) {
      throw new BadRequestException(
        'Failed to fetch mime type of resource from url',
      );
    }

    // 2️⃣ Prepare file path
    const ext = mimeType.split('/')[1] || 'bin';
    const name = randomUUID();
    const folder =
      process.env.RESOURCE_FOLDER ?? path.join(__dirname, '/static_resources');
    const relativePath = path.join(folder, `${name}.${ext}`);

    // Ensure folder exists
    fs.mkdirSync(folder, { recursive: true });

    // 3️⃣ Download and save
    try {
      const response = await fetch(url);

      if (!response.ok || !response.body) {
        throw new BadRequestException('Failed to fetch file body');
      }

      const stream =
        response.body instanceof Readable
          ? response.body // (in some older Node versions)
          : Readable.fromWeb(
              response.body as unknown as NodeReadableStream<any>,
            );

      const fileStream = fs.createWriteStream(relativePath);

      await new Promise((resolve, reject) => {
        stream.pipe(fileStream);
        stream.on('error', reject);
        fileStream.on('finish', () => {
          resolve(null);
        });
        fileStream.on('error', reject);
      });
    } catch {
      throw new BadRequestException('Failed to download file from URL');
    }

    // 4️⃣ Return info
    return {
      name,
      mimeType: mimeType,
      path: relativePath,
      real_name: filename,
    };
  }

  async createResource(
    mimeType: string,
    name: string,
    author: User,
    real_name: string,
  ): Promise<ResourceModel> {
    const newResource = new this.resource({
      mimeType,
      path: path.join(
        process.env.RESOURCE_FOLDER ??
          path.join(__dirname, '/static_resources'),
        name + '.' + mimeType.split('/')[1],
      ),
      author,
      real_name,
    });

    await newResource.save();

    return newResource;
  }
  async getResourcePath(id: string) {
    const resource = await this.resource.findById(id);
    return (
      resource?.path ||
      path.join(
        process.env.RESOURCE_FOLDER ??
          path.join(__dirname, '/static_resources'),
        'undefined.png',
      )
    );
  }

  async getResourceData(id: string) {
    const resource = await this.resource.findById(id);
    return resource;
  }

  async getAllResources() {
    const resource = await this.resource.find();
    return resource;
  }

  async deleteResource(id: string) {
    await this.resource.findByIdAndDelete(id);
    return true;
  }
  deleteContent(path: string) {
    fs.unlinkSync(path);

    return true;
  }
}
