import { Expose } from 'class-transformer';

export class AppConfigModel {
    @Expose()
    appName: string;
}
