import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AssignmentDocument = Assignment & Document;

@Schema({ timestamps: true })
export class Assignment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teacherId!: Types.ObjectId;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  instructions!: string;

  @Prop({ required: true })
  totalMarks!: number;

  @Prop({ default: 50 })
  passingMarks!: number;

  @Prop({ enum: ['strict', 'loose'], default: 'strict' })
  markingMode!: string;
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);