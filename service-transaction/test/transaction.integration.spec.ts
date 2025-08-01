import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModule } from '../src/modules/transaction/transaction.module';
import { Transaction } from '../src/modules/transaction/transaction.entity';
import { BankingDetails } from '../src/modules/bankingDetails/bankingDetails.entity';
import { User } from '../src/modules/user/user.entity';
import { AccountType } from '../src/utils/enum/bankingDetails.enum';

describe('Transaction Integration Tests', () => {
  let app: INestApplication;

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
          entities: [Transaction, BankingDetails, User],
          synchronize: true,
          logging: false,
        }),
        TransactionModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up database before each test
    // This would typically be done with a test database setup
  });

  describe('GET /transactions', () => {
    it('should return all transactions', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /transactions/:id', () => {
    it('should return a transaction by id', async () => {
      // First create a transaction (this would require setup data)
      // For now, we'll test the endpoint structure
      await request(app.getHttpServer()).get('/transactions/1').expect(200);
    });

    it('should return 404 for non-existent transaction', async () => {
      await request(app.getHttpServer())
        .get('/transactions/999999')
        .expect(404);
    });
  });

  describe('POST /transactions', () => {
    it('should create a new transaction', async () => {
      const transactionData = {
        amount: 100.5,
        description: 'Test transaction',
        senderAccountNumber: 123456,
        senderAgency: 1,
        senderAccountType: AccountType.CORRENTE,
        receiverAccountNumber: 654321,
        receiverAgency: 2,
        receiverAccountType: AccountType.POUPANCA,
      };

      const response = await request(app.getHttpServer())
        .post('/transactions')
        .send(transactionData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('amount', transactionData.amount);
      expect(response.body).toHaveProperty(
        'description',
        transactionData.description,
      );
      expect(response.body).toHaveProperty('senderUserId');
      expect(response.body).toHaveProperty('receiverUserId');
    });

    it('should return 403 when amount is less than or equal to 0', async () => {
      const invalidTransactionData = {
        amount: 0,
        description: 'Invalid transaction',
        senderAccountNumber: 123456,
        senderAgency: 1,
        senderAccountType: AccountType.CORRENTE,
        receiverAccountNumber: 654321,
        receiverAgency: 2,
        receiverAccountType: AccountType.POUPANCA,
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .send(invalidTransactionData)
        .expect(403);
    });

    it('should return 403 when banking details not found', async () => {
      const transactionData = {
        amount: 100.5,
        description: 'Test transaction',
        senderAccountNumber: 999999,
        senderAgency: 999,
        senderAccountType: AccountType.CORRENTE,
        receiverAccountNumber: 888888,
        receiverAgency: 888,
        receiverAccountType: AccountType.POUPANCA,
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .send(transactionData)
        .expect(403);
    });
  });

  describe('GET /transactions/user/:id', () => {
    it('should return transactions for a user', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions/user/1')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
