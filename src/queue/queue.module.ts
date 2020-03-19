import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
require('dotenv').config();

const additionalConfig = process.env.NODE_ENV === 'production' ? {
  password: process.env.REDIS_PASSWORD,
  name: process.env.REDIS_PATH,
} : {};

const Queue = BullModule.registerQueue({
  name: 'prescription',
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    ...additionalConfig,
  },
});

@Module({
  imports: [Queue],
  exports: [Queue],
})
export class QueueModule {}
