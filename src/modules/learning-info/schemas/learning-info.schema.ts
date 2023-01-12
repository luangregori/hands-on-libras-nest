import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class LearningInfo extends Document {
  @Prop()
  id: string;

  @Prop()
  description: string;

  @Prop()
  word: string;

  @Prop()
  lessonId: string;
}

export const LearningInfoSchema = SchemaFactory.createForClass(LearningInfo);
