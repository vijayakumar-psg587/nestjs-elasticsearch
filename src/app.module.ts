import { Module } from '@nestjs/common';
import { CoreModule } from './modules/core/core.module';
import { EsModule } from './modules/es/es.module';

@Module({
    imports: [CoreModule, EsModule],
})
export class AppModule {}
