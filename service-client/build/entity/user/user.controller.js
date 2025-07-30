"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const kafka_service_1 = require("../../kafka/service/kafka.service");
let UserController = class UserController {
    constructor(kafkaService) {
        this.kafkaService = kafkaService;
    }
    async sendTestMessage() {
        await this.kafkaService.sendMessage('user_created', {
            id: Date.now(),
            name: 'João',
        });
        console.log('Message sent');
        return { status: 'sent' };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendTestMessage", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [kafka_service_1.KafkaService])
], UserController);
//# sourceMappingURL=user.controller.js.map