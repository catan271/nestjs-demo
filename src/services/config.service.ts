import { Injectable } from '@nestjs/common';
import { roles } from '../constants/roles.constant';
import { accountStatus } from '../constants/accountStatus.constant';

@Injectable()
export class ConfigService {
    async getConstants() {
        return {
            roles,
            accountStatus,
        };
    }
}
