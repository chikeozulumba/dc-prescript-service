import { Controller, Get, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthUser } from 'src/shared/decorators/user';
import { User } from 'src/user/user';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async GetPrescriptionsHistory(@AuthUser() authUser: User) {
    return await this.historyService.getPrescriptionsHistory(authUser);
  }
}
