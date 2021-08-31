import { Expose, Transform, Type } from 'class-transformer';
import { AppConfigModel } from './app.config.model';
export class ESConfigModel {
    @Expose()
    @Type(() => AppConfigModel)
    app?: AppConfigModel;
    @Expose()
    esCluster: string;
    @Expose()
    esPort: number;
    @Expose()
    esUserName: string;
    @Expose()
    esPassword: string;
    @Expose()
    esRetries: number;
}
