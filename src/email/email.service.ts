import { Injectable } from '@nestjs/common';

const SendGridMail = require('@sendgrid/mail');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

@Injectable()
export class EmailService {
  private sendgrid: any = SendGridMail;
  constructor() {
    this.sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async parseTemplateToHTML(
    payload,
    filePath = '../../templates/prescription.hbs',
  ) {
    try {
      require('dotenv').config();
      const source = fs.readFileSync(path.resolve(__dirname, filePath), 'utf8');
      const template = Handlebars.compile(source);
      return template(payload);
    } catch (err) {
      console.error(err.toString());
    }
  }

  async sendMail(payload) {
    try {
      await this.sendgrid.send(payload);
    } catch (err) {
      console.error(err.toString());
    }
  }
}
