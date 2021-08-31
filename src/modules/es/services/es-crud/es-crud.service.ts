import { Body, Injectable, Scope } from '@nestjs/common';
import { EsConfigService } from '../es-config/es-config.service';
import { EsUtilService } from '../es-util/es-util.service';
import { Client } from '@elastic/elasticsearch';
import * as _ from 'lodash';
import P from 'pino';

@Injectable({
    scope: Scope.REQUEST,
})
export class EsCrudService {
    private client: Client;
    constructor(private readonly esConfigService: EsConfigService) {
        this.esConfigService.createESConnection().then((conn) => {
            this.client = conn;
        });
    }

    /**
     * Create specified index
     */

    public async createIndex(indexName: string, sourceName: string): Promise<unknown> {
        return new Promise(async (resolve, reject) => {
            if (this.client) {
                // first create index
                // Body should contain params for the new idnex
                //const indexDetails = await EsUtilService.createIndex(indexName, sourceName, this.client, null);
                //console.log(indexDetails.body);
                await EsUtilService.checkIfIndexExists(indexName, this.client)
                    .then((data) => {
                        console.log('Is Index data available after validation:', data);
                        resolve(data);
                    })
                    .catch(async (err) => {
                        // if rejected it means no index exits, so proceed with creating one
                        console.log('Index data unavailable afte validation:', err);
                        try {
                            const indexResult = await EsUtilService.createIndex(
                                indexName,
                                sourceName,
                                this.client,
                                null,
                            );
                            console.log('Index result is:', indexResult);
                            if (indexResult.statusCode === 200) {
                                resolve(indexResult.body);
                            }
                        } catch (err) {
                            console.log('err in creating index:', err);
                            reject(err);
                        }
                    });
            }
        });
    }

    public async insertBulkData(index: string, sourceName: string): Promise<unknown> {
        return new Promise(async (resolve, reject) => {
            // first check if index is available
            if (this.client) {
                await EsUtilService.checkIfIndexExists(index, this.client)
                    .then(async (data) => {
                        console.log('Index is available so start inserting data:', data);
                        const insertResult = await EsUtilService.insertBulkData(index, sourceName, this.client).catch(
                            (err) => {
                                reject(err);
                            },
                        );
                        if (insertResult) {
                            console.log('Data inserted succesfully', insertResult);
                            resolve(insertResult);
                        }
                    })
                    .catch(async (err) => {
                        console.log('Most probably index is not available, so first create and then insert');
                        const indexResult = await this.createIndex(index, null).catch((idxCreateErr) => {
                            console.log('Error creating index:', err);
                            reject(idxCreateErr);
                        });
                        if (indexResult) {
                            // means index created succesfully, so proceed inserting data
                            const insertResult = await EsUtilService.insertBulkData(
                                index,
                                sourceName,
                                this.client,
                            ).catch((err) => {
                                reject(err);
                            });
                            if (insertResult) {
                                console.log('Data inserted succesfully', insertResult);
                                resolve(insertResult);
                            }
                        }
                    });
            }
        });
    }
}
