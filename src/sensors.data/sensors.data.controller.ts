import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SensorsDataService } from './sensors.data.service';
import { DataPayloadInterface } from './interfaces/data.payload.interface';

@Controller('sensorsData')
export class SensorsDataController {
  constructor(private sensorsDataService: SensorsDataService) {}

  @MessagePattern({ cmd: 'sensors.data.update' })
  async updateData(
    @Payload()
    {
      userId,
      deviceId,
      deviceTopic,
      dataPayload,
    }: {
      userId: number;
      deviceId: number;
      deviceTopic: string;
      dataPayload: DataPayloadInterface | DataPayloadInterface[];
    },
  ) {
    await this.sensorsDataService.checkDeviceTopic(
      userId,
      deviceId,
      deviceTopic,
    );
    return this.sensorsDataService.updateData(
      deviceId,
      deviceTopic,
      dataPayload,
    );
  }

  @MessagePattern({ cmd: 'sensors.data.get.latest' })
  async getLatestData(
    @Payload()
    {
      userId,
      deviceId,
      deviceTopic,
    }: {
      userId: number;
      deviceId: number;
      deviceTopic: string;
    },
  ) {
    await this.sensorsDataService.checkDeviceTopic(
      userId,
      deviceId,
      deviceTopic,
    );
    return this.sensorsDataService.getLatestData(deviceId, deviceTopic);
  }

  @MessagePattern({ cmd: 'sensors.data.get.periodic' })
  async getPeriodicData(
    @Payload()
    {
      userId,
      deviceId,
      deviceTopic,
      from,
      to,
    }: {
      userId: number;
      deviceId: number;
      deviceTopic: string;
      from: string | Date;
      to: string | Date;
    },
  ) {
    await this.sensorsDataService.checkDeviceTopic(
      userId,
      deviceId,
      deviceTopic,
    );
    return this.sensorsDataService.getPeriodicData(
      deviceId,
      deviceTopic,
      from,
      to,
    );
  }
}
