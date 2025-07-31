import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  constructor() {}

  @EventPattern('user_created')
  handleUserCreated(message: any) {
    console.log(message);
  }
}
