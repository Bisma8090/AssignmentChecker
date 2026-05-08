import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionDocument } from './submission.schema';
import { AiService } from '../ai/ai.service';
import { AssignmentsService } from '../assignments/assignments.service';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name)
    private submissionModel: Model<SubmissionDocument>,
    private aiService: AiService,
    private assignmentsService: AssignmentsService,
  ) {}

  async evaluateAndSave(data: {
    assignmentId: string;
    extractedText: string;
    originalFileName: string;
  }) {
    const assignment = await this.assignmentsService.findById(data.assignmentId);

    const aiResult = await this.aiService.evaluateSubmission({
      title: assignment.title,
      instructions: assignment.instructions,
      totalMarks: assignment.totalMarks,
      markingMode: assignment.markingMode,
      submissionText: data.extractedText,
    });

    const submission = new this.submissionModel({
      assignmentId: data.assignmentId,
      studentName: aiResult.studentName,
      rollNumber: aiResult.rollNumber,
      originalFileName: data.originalFileName,
      extractedText: data.extractedText,
      score: aiResult.score,
      remarks: aiResult.remarks,
      status: 'evaluated',
    });

    return submission.save();
  }

  async getByAssignment(assignmentId: string) {
    return this.submissionModel
      .find({ assignmentId })
      .sort({ score: -1 });
  }
}