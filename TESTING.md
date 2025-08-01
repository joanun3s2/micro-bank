# Testing Guide

This document provides information about the testing setup for both microservices in the micro-bank project.

## Overview

Both services have comprehensive test suites including:

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test the full request-response cycle
- **E2E Tests**: Test the complete application flow

## Test Structure

### Service-Client Tests

#### Unit Tests

- `src/modules/user/user.service.spec.ts` - UserService unit tests
- `src/modules/user/user.controller.spec.ts` - UserController unit tests

#### Integration Tests

- `test/user.integration.spec.ts` - User module integration tests

### Service-Transaction Tests

#### Unit Tests

- `src/modules/transaction/transaction.service.spec.ts` - TransactionService unit tests
- `src/modules/transaction/transaction.controller.spec.ts` - TransactionController unit tests

#### Integration Tests

- `test/transaction.integration.spec.ts` - Transaction module integration tests

## Running Tests

### Prerequisites

1. Install dependencies for both services:

```bash
cd service-client && npm install
cd ../service-transaction && npm install
```

2. Set up test database (PostgreSQL):

```bash
# Create test database
createdb test_db
```

### Running Unit Tests

#### Service-Client

```bash
cd service-client
npm test
```

#### Service-Transaction

```bash
cd service-transaction
npm test
```

### Running Integration Tests

#### Service-Client

```bash
cd service-client
npm run test:e2e
```

#### Service-Transaction

```bash
cd service-transaction
npm run test:e2e
```

### Running Tests with Coverage

#### Service-Client

```bash
cd service-client
npm run test:cov
```

#### Service-Transaction

```bash
cd service-transaction
npm run test:cov
```

### Running Tests in Watch Mode

#### Service-Client

```bash
cd service-client
npm run test:watch
```

#### Service-Transaction

```bash
cd service-transaction
npm run test:watch
```

## Test Configuration

### Jest Configuration

Both services use Jest as the testing framework with the following configuration:

- **Test Environment**: Node.js
- **Test Pattern**: `*.spec.ts` files
- **Coverage**: Generated in `../coverage` directory
- **Transform**: TypeScript files using `ts-jest`

### Database Setup for Integration Tests

Integration tests require a PostgreSQL database. The tests are configured to use:

- Host: `localhost`
- Port: `5432`
- Database: `test_db`
- Username: `test`
- Password: `test`

## Test Coverage

The test suites cover:

### Service-Client

- User creation, retrieval, update, and deletion
- Profile picture upload functionality
- Duplicate user validation
- Error handling for non-existent users
- Kafka message publishing

### Service-Transaction

- Transaction creation with validation
- Banking details verification
- User existence validation
- Transaction retrieval by user
- Error handling for invalid amounts
- Error handling for non-existent banking details

## Writing New Tests

### Unit Tests

1. Create a `.spec.ts` file next to the component you're testing
2. Import the necessary testing utilities from `@nestjs/testing`
3. Mock dependencies using Jest's mocking capabilities
4. Test both success and error scenarios

### Integration Tests

1. Create test files in the `test/` directory
2. Use `supertest` for HTTP request testing
3. Set up test database connections
4. Clean up test data between tests

### Example Unit Test Structure

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { YourService } from "./your.service";

describe("YourService", () => {
  let service: YourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YourService],
    }).compile();

    service = module.get<YourService>(YourService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
```

## Best Practices

1. **Mock External Dependencies**: Always mock database, external APIs, and Kafka services
2. **Test Error Scenarios**: Include tests for error conditions and edge cases
3. **Use Descriptive Test Names**: Test names should clearly describe what is being tested
4. **Keep Tests Simple**: Each test should focus on a single behavior
5. **Clean Up**: Always clean up mocks and test data after each test

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Ensure PostgreSQL is running and test database exists
2. **Import Errors**: Check that all required modules are properly imported
3. **TypeScript Errors**: Ensure all types are properly defined
4. **Test Timeouts**: Increase timeout for integration tests if needed

### Debugging Tests

Run tests in debug mode:

```bash
npm run test:debug
```

This will allow you to set breakpoints and step through your tests.
