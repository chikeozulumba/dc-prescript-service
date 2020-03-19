import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
require('dotenv').config();

const Queue = BullModule.registerQueue({
  name: 'prescription',
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
});

@Module({
  imports: [Queue],
  exports: [Queue],
})
export class QueueModule {}
