"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const getAppDataSource = (configService) => {
    return new typeorm_1.DataSource({
        type: 'postgres',
        host: configService.get('CLIENT_DATABASE_HOST'),
        port: configService.get('CLIENT_DATABASE_PORT'),
        username: configService.get('CLIENT_DATABASE_USER'),
        password: configService.get('CLIENT_DATABASE_PASSWORD'),
        database: configService.get('CLIENT_DATABASE_NAME'),
        synchronize: true,
        logging: false,
        entities: [User_1.User],
        migrations: [],
        subscribers: [],
    });
};
exports.getAppDataSource = getAppDataSource;
//# sourceMappingURL=data-source.js.map