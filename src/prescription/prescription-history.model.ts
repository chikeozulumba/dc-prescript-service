import * as mongoose from 'mongoose';
import { format, compareAsc, isValid, addDays, parseISO } from 'date-fns';
import { UnprocessableEntityException } from '@nestjs/common';
import { datesDifferenceInDays } from 'src/shared/date';

const PrescriptionHistoryModel = new mongoose.Schema({
  quantityTaken: {
    type: Number,
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
  currentTime: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default PrescriptionHistoryModel;
