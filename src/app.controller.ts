import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  // constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }
  @Get()
  @Render('index')
  root() {
    return { message: 'bonjourcsscsccsccs' };
  }
}
