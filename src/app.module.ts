import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorsDataModule } from './sensors.data/sensors.data.module';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}.local`,
      isGlobal: true,
    }),
    SensorsDataModule,
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionName: 'sensors',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
