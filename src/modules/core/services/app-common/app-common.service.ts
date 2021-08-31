import { Injectable, Scope } from '@nestjs/common';
import { ESConfigModel } from '../../models/es.config.model';
import atob = require('atob');
@Injectable({
    scope: Scope.TRANSIENT,
})
export class AppCommonService {
    private esConfigModel: ESConfigModel = null;

    public getESConfigModel(): ESConfigModel {
        if (!this.esConfigModel) {
            this.esConfigModel = new ESConfigModel();
            this.esConfigModel.esCluster = process.env.ES_CLUSTER;
            this.esConfigModel.esPort = +process.env.ES_PORT;
            this.esConfigModel.esUserName = process.env.ES_USERNAME;
            this.esConfigModel.esPassword = process.env.ES_PASSWORD
                ? (<string>atob(process.env.ES_PASSWORD)).trim()
                : '';
            this.esConfigModel.esRetries = +process.env.ES_RETRIES;
        }
        return this.esConfigModel;
    }
}
