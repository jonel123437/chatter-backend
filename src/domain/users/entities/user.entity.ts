import * as bcrypt from 'bcrypt';
import { DEFAULT_PROFILE_PICTURE, DEFAULT_COVER_PICTURE } from '../../shared/constants/defaults';

export class User {
  public profilePicture: string;
  public coverPicture: string;

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    profilePicture?: string,
    coverPicture?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {
    // Always fallback to defaults if values are not provided
    this.profilePicture = profilePicture || DEFAULT_PROFILE_PICTURE;
    this.coverPicture = coverPicture || DEFAULT_COVER_PICTURE;
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
