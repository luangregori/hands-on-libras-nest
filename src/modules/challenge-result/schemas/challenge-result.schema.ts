import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum StatusChallengeResult {
  STARTED = 'started',
  LEARNED = 'learned',
  TESTED = 'tested',
  COMPLETED = 'completed'
}

@Schema()
export class ChallengeResult extends Document {
  @Prop()
  accountId: string;

  @Prop()
  lessonId: string;

  @Prop()
  status: StatusChallengeResult;

  @Prop()
  score: number;

  @Prop()
  updatedAt: Date
}

export const ChallengeResultSchema = SchemaFactory.createForClass(ChallengeResult);
