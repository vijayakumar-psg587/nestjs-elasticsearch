import { Module } from '@nestjs/common';
import { CoreModule } from '../core/core.module';
import { EsConfigService } from './services/es-config/es-config.service';
import { EsCrudService } from './services/es-crud/es-crud.service';
import { EsUtilService } from './services/es-util/es-util.service';

@Module({
    providers: [EsConfigService, EsCrudService, EsUtilService],
    imports: [CoreModule],
})
export class EsModule {}
