import { Client } from '@elastic/elasticsearch';
import { ApiResponse, TransportRequestPromise } from '@elastic/elasticsearch/lib/Transport';
import { Injectable, Scope } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
@Injectable({
    scope: Scope.REQUEST,
})
export class EsUtilService {
    private static fetchMoviesData(): string {
        const movieData = fs.readFileSync(path.join(process.cwd(), './dataSet/movies.json')).toString('utf-8');
        return movieData;
    }

    public static createIndex(
        indexName: string,
        sourceName: string,
        client: Client,
        typeSchema: unknown,
    ): Promise<ApiResponse<Record<any, string>>> {
        if (!typeSchema) {
            typeSchema = {
                id: { type: 'integer', index: true },
                title: { type: 'text' },
                year: { type: 'integer' },
                v: { type: 'version' },
                genre: { type: 'text' },
            };
        }
        return Promise.resolve(
            client.indices.create({
                index: indexName,
                error_trace: true,
                pretty: true,
            }),
        );
    }

    public static checkIfIndexExists(indexNameToCheck: string, client: Client): Promise<unknown> {
        return new Promise(async (resolve, reject) => {
            try {
                const isIndexAvaialble = await client.cat.indices({ index: indexNameToCheck });
                if (isIndexAvaialble.statusCode === 200) {
                    resolve('Available');
                }
            } catch (err) {
                console.log('Searched Index is not avaialble');
                reject('Unavailable');
            }
        });
    }

    public static async insertBulkData(indexToInsert: string, sourceName: string, client: Client): Promise<unknown> {
        return new Promise(async (resolve, reject) => {
            const dataToInsert = EsUtilService.fetchMoviesData();
            /**
             * Important things to remember  -
             * Always make sure to insert newLIne at the end of data for bulkInsert
             * Always make sure that it is not actual JSON formatted data but just a string similar to JSON
             * we are inserting, so remember to refer to the one provided in movies.json
             */
            const { body: bulkResponse } = await client.bulk({
                _source: sourceName,
                index: indexToInsert,
                pretty: true,
                body: dataToInsert,
            });

            if (bulkResponse.errors) {
                const erroredDocuments = [];
                // The items array has the same order of the dataset we just indexed.
                // The presence of the `error` key indicates that the operation
                // that we did for the document has failed.
                bulkResponse.items.forEach((action, i) => {
                    console.log('ggeting index data in error:', action, i);
                    const operation = Object.keys(action)[0];
                    if (action[operation].error) {
                        erroredDocuments.push({
                            // If the status is 429 it means that you can retry the document,
                            // otherwise it's very likely a mapping error, and you should
                            // fix the document before to try it again.
                            status: action[operation].status,
                            error: action[operation].error,
                        });
                    }
                });

                reject(erroredDocuments);
            } else {
                resolve(bulkResponse);
            }
        });
    }
}
