import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user_created')
  async handleUserCreated(user: any) {
    return await this.userService.create({ ...user, sourceId: user.id });
  }

  @MessagePattern('user_updated')
  async handleUserUpdated(@Payload() user: Partial<User>) {
    return await this.userService.update(user.id, user);
  }

  @MessagePattern('user_deleted')
  async handleUserDeleted(message: any) {
    return await this.userService.remove(message.value as number);
  }
}
