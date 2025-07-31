import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { KafkaService } from '../../kafka/service/kafka.service';
import { UserService } from './user.service';
import { User } from './user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly kafkaService: KafkaService,
  ) {}

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() createDto: Partial<User>) {
    const result = await this.userService.create(createDto);

    this.kafkaService.sendMessage('user_created', result);

    return result;
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() createDto: Partial<User>) {
    const result = await this.userService.update(id, createDto);

    this.kafkaService.sendMessage('user_updated', result);

    return result;
  }

  @Patch(':id/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  remove(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    return this.userService.updateProfilePicture(id, file);
  }
}
