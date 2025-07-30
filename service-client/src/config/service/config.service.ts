import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, validate } from 'class-validator';

class EnvConfig {
  @IsString()
  @IsNotEmpty()
  CLIENT_NODE_ENV: string;

  @IsString()
  @IsNotEmpty()
  CLIENT_DATABASE_NAME: string;

  @IsString()
  @IsNotEmpty()
  CLIENT_DATABASE_HOST: string;

  @IsString()
  @IsNotEmpty()
  CLIENT_DATABASE_PORT: number;

  @IsString()
  @IsNotEmpty()
  CLIENT_DATABASE_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  CLIENT_DATABASE_USER: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(private readonly nestConfigService: NestConfigService) {
    const env = this.nestConfigService.get<string>('CLIENT_NODE_ENV', 'dev');

    if (env === 'dev') {
      this.envConfig = plainToInstance(EnvConfig, process.env);
      this.validateEnvConfig();
    }
  }

  private async validateEnvConfig() {
    const errors = await validate(this.envConfig);
    if (errors.length) {
      throw new Error(`Config validation failed: ${errors}`);
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
