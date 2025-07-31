import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  handleUserCreated(message: any) {
    console.log(message);
  }
}
