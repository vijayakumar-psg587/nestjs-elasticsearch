import { Client } from '@elastic/elasticsearch';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EsModule } from './modules/es/es.module';
import { EsConfigService } from './modules/es/services/es-config/es-config.service';
import { EsCrudService } from './modules/es/services/es-crud/es-crud.service';

let app;
async function bootstrap() {
    app = await NestFactory.createApplicationContext(AppModule);
    let esConn: Client = null;
    // const appS = app.select(AppModule).get(AppService, { strict: true });
    // console.log(appS.getHello());

    // Now call esService to create connection
    const esConfigService = app.select(EsModule).resolve(EsConfigService);
    esConn = await (await esConfigService).createESConnection().catch((err) => {
        process.stderr.write(`Connection failed: ${err}`);
        process.exit(1);
    });

    const esCrdService = app.select(EsModule).resolve(EsCrudService);
    await (await esCrdService).createIndex('test-tweet', 'http://test');
    //app.enableShutdownHooks() -  This doesnt work for standlone apps
    await (await esCrdService).insertBulkData('movies', 'http://sundog.media/movies');
    await app
        .close()
        .then(async (data) => {
            // closing esConn
            await esConn.close();
        })
        .catch(async (err) => {
            await esConn.close();
            // there is error in closing the app
            process.stderr.write(`Error in closing the app: ${err.message}`);
            process.exit(1);
        });
}
bootstrap();
process.on('SIGINT', (signal) => {
    process.stderr.write(`Received signal: ${signal} : Closing the app`);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    process.stderr.write(`Unhandled rejection received: ${err['message']} : Closing the app`);
    process.exit(1);
});
