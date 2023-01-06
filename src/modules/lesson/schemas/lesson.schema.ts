import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Lesson extends Document {
  @Prop()
  name: string;

  @Prop()
  image_url: string;

  @Prop()
  description: string;

  @Prop()
  categoryId: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
