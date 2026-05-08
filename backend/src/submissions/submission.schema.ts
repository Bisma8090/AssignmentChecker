import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubmissionDocument = Submission & Document;

@Schema({ timestamps: true })
export class Submission {
  @Prop({ type: Types.ObjectId, ref: 'Assignment', required: true })
  assignmentId!: Types.ObjectId;

  @Prop({ required: true })
  studentName!: string;

  @Prop({ required: true })
  rollNumber!: string;

  @Prop()
  originalFileName!: string;

  @Prop()
  extractedText!: string;

  @Prop({ default: 0 })
  score!: number;

  @Prop()
  remarks!: string;

  @Prop({ enum: ['pending', 'evaluated', 'failed'], default: 'pending' })
  status!: string;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);