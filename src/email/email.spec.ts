import { EmailService } from './email.service';

describe('Email', () => {
  it('should be defined', () => {
    expect(new EmailService()).toBeDefined();
  });
});
