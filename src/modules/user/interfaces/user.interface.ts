
import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly name: string;
  readonly email: string;
  readonly image_url: string;
  readonly email_verified: boolean;
}

export interface LoadUserInfo {
  name: string
  image_url?: string
  // TODO: add achievements
  // achievements: AchievementModel[]
}