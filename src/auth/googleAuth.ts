import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class OAuthClient {
  private googleClient: OAuth2Client;
  constructor() {
    this.googleClient = new OAuth2Client({
      client_id: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    });
  }
  generateLink() {
    return this.googleClient.generateAuthUrl({
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      access_type: 'offline',
      prompt: 'consent',
      response_type: 'code',
    });
  }
  async getUserDataByCode(code: string) {
    const { tokens } = await this.googleClient.getToken(code);
    this.googleClient.setCredentials(tokens);

    const responce: { data: unknown } = await this.googleClient.fetch(
      'https://www.googleapis.com/oauth2/v1/userinfo',
    );

    console.log(responce.data);

    return responce.data;
  }
}
