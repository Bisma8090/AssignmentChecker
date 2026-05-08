import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('assignments')
@UseGuards(JwtAuthGuard)
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  create(@Request() req: any, @Body() body: any) {
    return this.assignmentsService.create(req.user._id.toString(), body);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.assignmentsService.findByTeacher(req.user._id.toString());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assignmentsService.findById(id);
  }
}
