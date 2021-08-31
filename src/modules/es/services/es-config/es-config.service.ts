import { Injectable, Scope } from '@nestjs/common';
import { ESConfigModel } from 'src/modules/core/models/es.config.model';
import { AppCommonService } from 'src/modules/core/services/app-common/app-common.service';
import { Client } from '@elastic/elasticsearch';
import { v4 as uuidv4 } from 'uuid';
import { ESAPP_CONST } from 'src/modules/core/util/app.constants';
@Injectable({
    scope: Scope.TRANSIENT,
})
export class EsConfigService {
    private esConfig: ESConfigModel;
    private esClient: Client;
    constructor(private configService: AppCommonService) {
        this.esConfig = this.configService.getESConfigModel();
    }

    public async createESConnection(): Promise<Client> {
        return new Promise((resolve) => {
            if (!this.esClient) {
                this.esClient = new Client({
                    generateRequestId: (params, options) => {
                        return uuidv4().toString();
                    },
                    headers: { 'app-name': ESAPP_CONST.APP_NAME },
                    node: this.esConfig.esCluster + ESAPP_CONST.COMMON.COLON + this.esConfig.esPort,
                    // auth: {
                    //     username: this.esConfig.esUserName,
                    //     password: this.esConfig.esPassword,
                    // },
                });
            }

            resolve(this.esClient);
        });
    }
}
