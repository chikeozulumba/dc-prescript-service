import * as mongoose from 'mongoose';
import { format, compareAsc, isValid, addDays, parseISO } from 'date-fns';
import { UnprocessableEntityException } from '@nestjs/common';
import { datesDifferenceInDays } from 'src/shared/date';

const PrescriptionModel = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    // unique: true,
  },
  drugName: {
    type: String,
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: ['tablets', 'liquid'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  dailyInterval: [
    {
      stringValue: {
        type: String,
        required: true,
      },
      dateValue: {
        type: Date,
        required: true,
      },
    },
  ],
  dosageDuration: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  dosageDurationInDays: {
    type: Number,
    required: true,
  },
  dosageTimeCountDaily: {
    type: Number,
    required: true,
  },
  totalDosageCount: {
    type: Number,
    required: true,
  },
  dosageCompleted: {
    type: Number,
    required: true,
  },
  additionalInformation: {
    type: String,
  },
  statusOfDosage: {
    type: String,
    default: 'ongoing',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

PrescriptionModel.pre('save', function(next) {
  if (
    !isValid(new Date(this.dosageDuration.start)) ||
    !isValid(new Date(this.dosageDuration.end))
  ) {
    throw new UnprocessableEntityException({
      message: 'Invalid dosage duration.',
    });
  }

  this.dosageTimeCountDaily = this.dailyInterval.length;
  this.dosageDuration.start = format(new Date(this.dosageDuration.start), "yyyy-MM-dd");
  this.dosageDuration.end = format(new Date(this.dosageDuration.end), "yyyy-MM-dd");

  next();
});

PrescriptionModel.pre('updateOne', function(next) {
  this.updatedAt = new Date();
  next();
});

export default PrescriptionModel;
