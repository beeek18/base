import { Controller, Get, HttpStatus } from '@nestjs/common';

import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('status')
  getStatus() {
    return HttpStatus.OK;
  }
}
