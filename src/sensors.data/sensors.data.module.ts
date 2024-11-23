import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { Data, DataSchema } from './schemas/data.schema';
import { SensorsDataController } from './sensors.data.controller';
import { SensorsDataService } from './sensors.data.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Data.name, schema: DataSchema }],
      'sensors',
    ),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        useFactory: async () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RMQ_URL],
            queue: process.env.RMQ_USER_QUEUE,
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  providers: [SensorsDataService],
  controllers: [SensorsDataController],
})
export class SensorsDataModule {}
