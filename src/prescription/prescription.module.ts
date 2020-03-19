import { Module } from '@nestjs/common';
import { PrescriptionController } from './prescription.controller';
import PrescriptionModel from './prescription.model';
import PrescriptionHistoryModel from './prescription-history.model';
import { MongooseModule } from '@nestjs/mongoose';
import { PrescriptionService } from './prescription.service';
import { QueueModule } from '../queue/queue.module';
import { PrescriptionProcessor } from './prescription-processor';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    QueueModule,
    MongooseModule.forFeature([
      { name: 'Prescription', schema: PrescriptionModel },
      { name: 'PrescriptionHistory', schema: PrescriptionHistoryModel },
    ]),
    EmailModule,
  ],
  controllers: [PrescriptionController],
  providers: [PrescriptionService, PrescriptionProcessor],
})
export class PrescriptionModule {}
