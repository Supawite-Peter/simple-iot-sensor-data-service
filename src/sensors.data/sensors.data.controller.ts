import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SensorsDataService } from './sensors.data.service';
import { DataUpdateInterface } from './interfaces/data.update.interface';

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
      dataPayload: DataUpdateInterface | DataUpdateInterface[];
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
      unix,
    }: {
      userId: number;
      deviceId: number;
      deviceTopic: string;
      unix?: boolean; // if true, return unix timestamp else return ISO timestamp
    },
  ) {
    await this.sensorsDataService.checkDeviceTopic(
      userId,
      deviceId,
      deviceTopic,
    );
    return this.sensorsDataService.getLatestData(deviceId, deviceTopic, unix);
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
      unix,
    }: {
      userId: number;
      deviceId: number;
      deviceTopic: string;
      from: string | number;
      to: string | number;
      unix?: boolean; // if true, return unix timestamp else return ISO timestamp
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
      unix,
    );
  }
}
