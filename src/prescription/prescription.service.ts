import { Injectable, ConflictException, UnprocessableEntityException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prescription, PrescriptionHistory } from './prescription';
import { User } from '../user/user';
import { DaysBetween } from 'src/shared/date';
import { Cron } from '@nestjs/schedule';
import { isValid, parseISO, compareAsc } from 'date-fns';
import { format } from 'date-fns';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectModel('Prescription') private PrescriptionModel: Model<Prescription>,
    @InjectModel('PrescriptionHistory') private PrescriptionHistoryModel: Model<PrescriptionHistory>,
    @InjectQueue('prescription') private audioQueue: Queue,
  ) {}

  async findPrescription(param) {
    return await this.PrescriptionModel.findOne(param);
  }

  async addPrescription(prescription: any, user: User) {
    const checkIfExists = await this.findPrescription({
      userId: user._id,
      title: prescription.title,
    });

    const preFormatDI = prescription.dailyInterval;
    if (Array.isArray(preFormatDI)) {
      preFormatDI.map((di, index) => {
        if (isValid(new Date(di))) return parseISO(di);
        throw new UnprocessableEntityException({
          message: 'Invalid daily dosage time selection',
        });
      });
      prescription.dailyInterval = preFormatDI
        .map(di => parseISO(di))
        .sort(compareAsc)
        .map(di => ({
          stringValue: format(new Date(di), 'HH:mm'),
          dateValue: di,
        }));
    }

    const dosageTimeCountDaily = prescription.dailyInterval.length;
    const dosageDurationInDays =
      DaysBetween(
        new Date(prescription.dosageDuration.start),
        new Date(prescription.dosageDuration.end),
      ) + 1;
    const newPrescription = new this.PrescriptionModel({
      ...prescription,
      user: user._id,
      dosageTimeCountDaily,
      dosageDurationInDays,
      totalDosageCount: dosageTimeCountDaily * dosageDurationInDays,
      dosageCompleted: 0,
    });
    return newPrescription.save();
  }

  async getPrescriptions(user: User) {
    const getPrescriptions = await this.PrescriptionModel.find({
      user: user._id,
    }).sort({ updatedAt: -1 });

    return getPrescriptions;
  }

  chunkArray(arrayData: any[], chunkSize: number) {
    var R = [];
    for (var i = 0; i < arrayData.length; i += chunkSize)
      R.push(arrayData.slice(i, i + chunkSize));
    return R;
  }

  @Cron('30 * * * * *')
  handlePrescriptions() {
    let currentTime = format(new Date(), 'HH:mm');
    // currentTime = '12:51';
    this.PrescriptionModel.find({
      'dosageDuration.start': { $lte: new Date() },
      'dosageDuration.end': { $gte: new Date() },
      'dailyInterval.stringValue': { $eq: currentTime },
    })
      .populate('user')
      .exec(async (err, docs) => {
        if (err) return;
        console.log(
          'At ' +
            currentTime +
            ' handlePrescriptions, is called, the payload found is ',
          docs.length,
        );
        if (docs.length > 0) {
          await this.audioQueue.add('handlePrescriptions', {
            currentTime,
            data: docs,
          });
        }
      });
  }

  async verifyPrescription(id: string, user: string) {
    const getPrescriptionHistory = await this.PrescriptionHistoryModel.findOneAndUpdate(
      {
        _id: id,
        user,
      },
      {
        verified: true,
      }
    );

    return {
      status: true,
      message: 'Record updated!'
    };
  }

  async deletePrescription(id: string, user: User) {
    await this.PrescriptionModel.remove({ _id: id, user: user._id });
  }
}
