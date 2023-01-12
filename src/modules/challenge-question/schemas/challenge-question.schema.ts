import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChallengeQuestion extends Document {
  @Prop()
  word: string;

  @Prop()
  lessonId: string;

  @Prop()
  options: Array<string>;

}

export const ChallengeQuestionSchema = SchemaFactory.createForClass(ChallengeQuestion);
