import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { exec } from 'child_process';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Query() query: string): any {
    // Next should be detected as a vulnerability. Remote Code Injection
    exec(`echo ${query}`);
    return { query };
  }
}
