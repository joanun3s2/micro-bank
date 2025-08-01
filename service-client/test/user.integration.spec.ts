import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../src/modules/user/user.module';
import { User } from '../src/modules/user/user.entity';
import { BankingDetails } from '../src/modules/bankingDetails/bankingDetails';
import { KafkaService } from '../src/kafka/service/kafka.service';

describe('User Integration Tests', () => {
  let app: INestApplication;

  const mockKafkaService = {
    sendMessage: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'test',
          password: 'test',
          database: 'test_db',
          entities: [User, BankingDetails],
          synchronize: true,
          logging: false,
        }),
        UserModule,
      ],
    })
      .overrideProvider(KafkaService)
      .useValue(mockKafkaService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          address: '123 Test St',
          age: 25,
        })
        .expect(201);

      const userId = (createResponse.body as User).id;

      const response = await request(app.getHttpServer())
        .get(`/users/${userId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer()).get('/users/999999').expect(404);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        address: '456 New St',
        age: 30,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', userData.name);
      expect(response.body).toHaveProperty('email', userData.email);
      expect(response.body).toHaveProperty('address', userData.address);
      expect(response.body).toHaveProperty('age', userData.age);
      expect(mockKafkaService.sendMessage).toHaveBeenCalledWith(
        'user_created',
        response.body,
      );
    });

    it('should return 403 when creating user with duplicate name', async () => {
      const userData = {
        name: 'Duplicate User',
        email: 'duplicate@example.com',
        address: '789 Duplicate St',
        age: 35,
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(403);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update an existing user', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Update Test User',
          email: 'updatetest@example.com',
          address: '123 Update St',
          age: 25,
        })
        .expect(201);

      const userId = (createResponse.body as User).id;

      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com',
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('name', updateData.name);
      expect(response.body).toHaveProperty('email', updateData.email);
      expect(mockKafkaService.sendMessage).toHaveBeenCalledWith(
        'user_updated',
        response.body,
      );
    });

    it('should return 404 when updating non-existent user', async () => {
      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com',
      };

      await request(app.getHttpServer())
        .patch('/users/999999')
        .send(updateData)
        .expect(404);
    });
  });

  describe('PATCH /users/:id/profile-picture', () => {
    it('should update user profile picture', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send({
          name: 'Profile Picture User',
          email: 'profile@example.com',
          address: '123 Profile St',
          age: 25,
        })
        .expect(201);

      const userId = (createResponse.body as User).id;

      const fileBuffer = Buffer.from('fake-image-data');

      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}/profile-picture`)
        .attach('file', fileBuffer, 'test.jpg')
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('profilePicture');
    });

    it('should return 404 when updating profile picture for non-existent user', async () => {
      const fileBuffer = Buffer.from('fake-image-data');

      await request(app.getHttpServer())
        .patch('/users/999999/profile-picture')
        .attach('file', fileBuffer, 'test.jpg')
        .expect(404);
    });
  });
});
