import * as bcrypt from 'bcrypt';
import { DEFAULT_PROFILE_PICTURE, DEFAULT_COVER_PICTURE } from '../../shared/constants/defaults';

export class User {
  public profilePicture: string;
  public coverPicture: string;
  public friends: string[];         // confirmed friendships
  public friendRequests: string[];  // incoming requests

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password?: string,  // <-- make optional
    profilePicture?: string,
    coverPicture?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    friends: string[] = [],
    friendRequests: string[] = []
  ) {
    this.profilePicture = profilePicture || DEFAULT_PROFILE_PICTURE;
    this.coverPicture = coverPicture || DEFAULT_COVER_PICTURE;
    this.friends = friends;
    this.friendRequests = friendRequests;
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.password) return false; // OAuth users have no password
    return bcrypt.compare(password, this.password);
  }

}
