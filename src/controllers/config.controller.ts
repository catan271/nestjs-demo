import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '../services/config.service';

@Controller('config')
export class ConfigController {
    constructor(private configService: ConfigService) {}

    @Get('/constants')
    async getConstants() {
        return this.configService.getConstants();
    }
}
