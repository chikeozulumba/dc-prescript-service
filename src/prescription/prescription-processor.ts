import { Processor, Process, OnQueueActive, OnQueueEvent, BullQueueEvents } from '@nestjs/bull';
import { Job, DoneCallback } from 'bull';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EmailService } from '../email/email.service';
import { PrescriptionHistory, Prescription } from './prescription';

require('dotenv').config();

@Processor('prescription')
export class PrescriptionProcessor {
  constructor(
    private readonly emailService: EmailService,
    @InjectModel('PrescriptionHistory')
    private PrescriptionHistoryModel: Model<PrescriptionHistory>,
    @InjectModel('Prescription')
    private PrescriptionModel: Model<Prescription>,
  ) {}
  @Process('handlePrescriptions')
  async handlePrescriptions(job: Job<unknown>, done:  DoneCallback) {
    // console.log(await this.emailService.parseTemplateToHTML());
    const {
      currentTime,
      data,
    }: any = job.data;
    for (let inner = 0; inner < data.length; inner += 1) {
      const prescription = data[inner];
      console.log('prescription', prescription);
      if (prescription.user) {
        const pHistory = await this.PrescriptionHistoryModel.create({
          user: prescription.user._id,
          prescription: prescription._id,
          currentTime,
          quantityTaken: prescription.quantity,
        });
        pHistory.save();
        const fields = {
          currentTime,
          fullName: prescription.user.fullName,
          drugName: prescription.drugName,
          title: prescription.title,
          quantity: prescription.quantity,
          type: prescription.type,
          verifyUrl:
            process.env.APP_URL +
            '/prescriptions/' +
            pHistory._id +
            '/verify/' +
            prescription.user._id,
        };

        await this.emailService.sendMail({
          from: `o.devcode@gmail.com`,
          to: prescription.user.email,
          subject: 'Dosage remainder for ' + currentTime,
          html: await this.emailService.parseTemplateToHTML(fields),
        });
        const currentDosageCount = (prescription.dosageCompleted += 1);
        this.PrescriptionModel.findOneAndUpdate(
          {
            _id: prescription._id,
          },
          {
            statusOfDosage:
              currentDosageCount === prescription.totalDosageCount
                ? 'completed'
                : prescription.statusOfDosage,
            dosageCompleted:
              currentDosageCount === prescription.totalDosageCount
                ? prescription.dosageCompleted
                : currentDosageCount,
          },
          (err, doc) => {
            if (err) return;
            done();
          },
        );
      }
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
    // console.log(job.data);
  }

  @OnQueueEvent(BullQueueEvents.COMPLETED)
  onCompleted(job: Job) {
    console.log(
      `Completed job ${job.id} of type ${job.name} with result ${job.returnvalue}`,
    );
  }
}
