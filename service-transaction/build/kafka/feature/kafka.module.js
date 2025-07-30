"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaModule = void 0;
const common_1 = require("@nestjs/common");
const kafka_service_1 = require("../service/kafka.service");
const config_module_1 = require("../../config/feature/config.module");
const microservices_1 = require("@nestjs/microservices");
let KafkaModule = class KafkaModule {
};
exports.KafkaModule = KafkaModule;
exports.KafkaModule = KafkaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            // ClientsModule.register([
            //   {
            //     name: 'KAFKA_SERVICE',
            //     transport: Transport.KAFKA,
            //     options: {
            //       client: {
            //         clientId: 'client-service',
            //         brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
            //       },
            //       consumer: {
            //         groupId: 'client-consumer',
            //       },
            //     },
            //   },
            // ]),
            // Kafka,
            microservices_1.ClientsModule.register([
                {
                    name: 'KAFKA_SERVICE',
                    transport: microservices_1.Transport.KAFKA,
                    options: {
                        client: {
                            clientId: 'kafka',
                            brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
                        },
                        consumer: {
                            groupId: 'consumer-group',
                        },
                    },
                },
            ]),
        ],
        providers: [kafka_service_1.KafkaService],
        exports: [kafka_service_1.KafkaService],
    })
], KafkaModule);
// {
//   transport: Transport.KAFKA,
//   options: {
//     client: {
//       brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
//     },
//     consumer: {
//       groupId: 'consumer-group',
//     },
//   },
// },
//# sourceMappingURL=kafka.module.js.map