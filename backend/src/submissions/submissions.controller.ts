import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PDFParse } from 'pdf-parse';

@Controller('submissions')
@UseGuards(JwtAuthGuard)
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post('upload/:assignmentId')
  @UseInterceptors(FilesInterceptor('pdfs', 50))
  async uploadAndEvaluate(
    @Param('assignmentId') assignmentId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    const results: any[] = [];

    for (const file of files) {
      try {
        const pdfData = await new PDFParse({ data: file.buffer }).getText();
        const extractedText = pdfData.text;

        const result = await this.submissionsService.evaluateAndSave({
          assignmentId,
          extractedText,
          originalFileName: file.originalname,
        });

        results.push(result);
      } catch (err) {
        results.push({
          originalFileName: file.originalname,
          studentName: 'Parse Error',
          rollNumber: 'N/A',
          score: 0,
          remarks: `Could not process file: ${file.originalname}`,
          status: 'failed',
        });
      }
    }

    return { success: true, total: results.length, results };
  }

  @Get('results/:assignmentId')
  async getResults(@Param('assignmentId') assignmentId: string) {
    return this.submissionsService.getByAssignment(assignmentId);
  }
}
