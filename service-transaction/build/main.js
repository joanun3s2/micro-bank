"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
require("reflect-metadata");
const config_service_1 = require("./config/service/config.service");
const data_source_1 = require("./data-source");
const User_1 = require("./entity/User");
const microservices_1 = require("@nestjs/microservices");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    //   AppModule,
    //   {
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
    //       },
    //       consumer: {
    //         groupId: 'consumer-group',
    //       },
    //     },
    //   },
    // );
    const configService = app.get(config_service_1.ConfigService);
    const appDataSource = (0, data_source_1.getAppDataSource)(configService);
    appDataSource
        .initialize()
        .then(async () => {
        console.log('Inserting a new user into the database...');
        const user = new User_1.User();
        user.firstName = 'Timber';
        user.lastName = 'Saw';
        user.age = 25;
        await appDataSource.manager.save(user);
        console.log('Saved a new user with id: ' + user.id);
        console.log('Loading users from the database...');
        const users = await appDataSource.manager.find(User_1.User);
        console.log('Loaded users: ', users);
        console.log('Here you can setup and run express / fastify / any other framework.');
    })
        .catch((error) => console.log(error));
    app.connectMicroservice({
        transport: microservices_1.Transport.KAFKA,
        options: {
            client: {
                brokers: [configService.get('KAFKA_BROKER') || 'kafka:9092'],
                consumer: {
                    groupId: 'consumer-group',
                },
            },
        },
    });
    await app.listen(configService.get('TRANSACTION_PORT') ?? 3000);
    await app.startAllMicroservices();
    // await app.listen();
}
bootstrap();
//# sourceMappingURL=main.js.map