import { User } from './../user/user.d';
import { Controller, Post, Body, UseGuards, Get, Delete, Param, HttpCode } from '@nestjs/common';
import { JoiValidationPipe } from 'src/shared/pipes/joi-validation.pipe';
import { addPrescriptionSchema, deletePrescriptionSchema } from './prescription.validation';
import { PrescriptionService } from './prescription.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from 'src/shared/decorators/user';

@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async GetPrescriptions(@AuthUser() authUser: User) {
    return await this.prescriptionService.getPrescriptions(authUser);
  }

  @Post('add')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async AddPrescription(
    @Body(new JoiValidationPipe(addPrescriptionSchema)) body,
    @AuthUser() authUser: User,
  ) {
    return await this.prescriptionService.addPrescription(body, authUser);
  }

  @Get('/:id/verify/:user')
  @HttpCode(200)
  async VerifyPrescription(
    @Param() { id, user },
  ) {
    return await this.prescriptionService.verifyPrescription(id, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async DeletePrescription(
    @Param(new JoiValidationPipe(deletePrescriptionSchema)) { id },
    @AuthUser() authUser: User,
  ) {
    return await this.prescriptionService.deletePrescription(id, authUser);
  }
}
