import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { QueueModule } from '../queue/queue.module';
import { MongooseModule } from '@nestjs/mongoose';
import PrescriptionModel from 'src/prescription/prescription.model';
import PrescriptionHistoryModel from 'src/prescription/prescription-history.model';

@Module({
  imports: [
    QueueModule,
    MongooseModule.forFeature([
      { name: 'PrescriptionHistory', schema: PrescriptionHistoryModel },
    ]),
  ],
  controllers: [HistoryController],
  providers: [HistoryService],
})
export class HistoryModule {}
