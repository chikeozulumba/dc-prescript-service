import { Injectable } from '@nestjs/common';
import { User } from '../user/user';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrescriptionHistory } from 'src/prescription/prescription';

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel('PrescriptionHistory')
    private PrescriptionHistoryModel: Model<PrescriptionHistory>,
  ) {}

  async getPrescriptionsHistory(user: User) {
    const hData = await this.PrescriptionHistoryModel.find({
      user: user._id,
    })
    .populate('prescription')
    .where('prescription').ne(null)
    .sort({ updatedAt: -1 });
    
    // return hData;
    
    return hData.filter(ph => ph.prescription !== null);
  }
}
