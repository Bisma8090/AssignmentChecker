import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment, AssignmentDocument } from './assignment.schema';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectModel(Assignment.name)
    private assignmentModel: Model<AssignmentDocument>,
  ) {}

  async create(teacherId: string, data: Partial<Assignment>): Promise<Assignment> {
    const assignment = new this.assignmentModel({ ...data, teacherId });
    return assignment.save();
  }

  async findById(id: string): Promise<Assignment> {
    const found = await this.assignmentModel.findById(id);
    if (!found) throw new NotFoundException('Assignment not found');
    return found;
  }

  async findByTeacher(teacherId: string): Promise<Assignment[]> {
    return this.assignmentModel.find({ teacherId }).sort({ createdAt: -1 });
  }
}