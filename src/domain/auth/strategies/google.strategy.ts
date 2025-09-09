import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, StrategyOptions, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../services/auth.service';

// Extend StrategyOptions to allow 'prompt'
interface ExtendedStrategyOptions extends StrategyOptions {
  prompt?: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_REDIRECT_URI!,
      scope: ['profile', 'email'],
      prompt: 'select_account', // ✅ forces account selection
    } as ExtendedStrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const user = {
      name: profile.displayName,
      email: profile.emails?.[0]?.value, // get Google email
      picture: profile.photos?.[0]?.value,
    };
    done(null, user);
  }
}
