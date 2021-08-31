import { Module } from '@nestjs/common';
import { AppCommonService } from './services/app-common/app-common.service';

@Module({
    providers: [AppCommonService],
    exports: [AppCommonService],
})
export class CoreModule {}
