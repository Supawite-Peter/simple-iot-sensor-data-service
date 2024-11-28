import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { Model } from 'mongoose';
import { Data } from './schemas/data.schema';
import { DataUpdateInterface } from './interfaces/data.update.interface';
import { DataQueryInterface } from './interfaces/data.query.interface';

@Injectable()
export class SensorsDataService {
  constructor(
    @Inject('USER_SERVICE') private client: ClientProxy,
    @InjectModel(Data.name, 'sensors')
    private dataModel: Model<Data>,
  ) {}

  async updateData(
    deviceId: number,
    topic: string,
    payload: DataUpdateInterface | DataUpdateInterface[],
  ): Promise<DataUpdateInterface[]> {
    if (Array.isArray(payload)) {
      if (payload.length === 1) {
        return await this.updateSingleData(deviceId, topic, payload[0]);
      } else {
        return await this.updateMultipleData(deviceId, topic, payload);
      }
    } else {
      return await this.updateSingleData(deviceId, topic, payload);
    }
  }

  private async updateSingleData(
    deviceId: number,
    topic: string,
    payload: DataUpdateInterface,
  ) {
    const doc = await this.dataModel.create({
      timestamp: payload.timestamp || new Date(),
      metadata: {
        deviceId: deviceId,
        topic: topic,
      },
      value: payload.value,
    });

    return [this.toDataPayload(doc)];
  }

  private async updateMultipleData(
    deviceId: number,
    topic: string,
    payloads: DataUpdateInterface[],
  ) {
    const dataToInsert = [];
    for (const payload of payloads) {
      dataToInsert.push({
        timestamp: payload.timestamp || new Date(),
        metadata: {
          deviceId: deviceId,
          topic: topic,
        },
        value: payload.value,
      });
    }

    const docs = await this.dataModel.insertMany(dataToInsert);

    return docs.map((doc) => this.toDataPayload(doc as Data));
  }

  async getLatestData(
    deviceId: number,
    topic: string,
    unix: boolean = false,
  ): Promise<DataQueryInterface> {
    const docs = await this.queryLatestData(deviceId, topic);

    if (docs.length === 0)
      throw new RpcException(new NotFoundException('No Latest Data Found'));

    return this.toDataPayload(docs[0], unix);
  }

  private queryLatestData(deviceId: number, topic: string): Promise<Data[]> {
    return this.dataModel
      .find({
        'metadata.deviceId': deviceId,
        'metadata.topic': topic,
      })
      .sort({ timestamp: -1 })
      .limit(1)
      .exec();
  }

  async getPeriodicData(
    deviceId: number,
    topic: string,
    from: string | Date | number,
    to: string | Date | number,
    unix: boolean = false,
  ): Promise<DataQueryInterface[]> {
    const docs = await this.queryPeriodicData(deviceId, topic, from, to);

    if (docs.length === 0)
      throw new RpcException(
        new NotFoundException('No Data Found From The Given Period'),
      );

    return docs.map((doc) => this.toDataPayload(doc, unix));
  }

  private queryPeriodicData(
    deviceId: number,
    topic: string,
    from: string | Date | number,
    to: string | Date | number,
  ): Promise<Data[]> {
    return this.dataModel
      .find({
        timestamp: { $gte: from, $lte: to },
        'metadata.deviceId': deviceId,
        'metadata.topic': topic,
      })
      .sort({ timestamp: -1 })
      .exec();
  }

  async checkDeviceTopic(
    userId: number,
    deviceId: number,
    deviceTopic: string,
  ) {
    const pattern = { cmd: 'user.device.topic.check' };
    const payload = { userId, deviceId, deviceTopic };
    const source = this.client
      .send(pattern, payload)
      .pipe(catchError((err) => throwError(() => new RpcException(err))));
    return firstValueFrom(source);
  }

  private toDataPayload(data: Data, unix: boolean = false): DataQueryInterface {
    return {
      timestamp: unix ? data.timestamp.getTime() : data.timestamp.toISOString(),
      value: data.value,
    };
  }
}
