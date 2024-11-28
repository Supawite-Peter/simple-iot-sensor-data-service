import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { throwError } from 'rxjs';
import { Data } from './schemas/data.schema';
import { SensorsDataService } from './sensors.data.service';
import { ModelMock } from './mocks/sensors.data.model.mock';
import { UserClientMock } from './mocks/user.client.mock';

describe('SensorsDataService', () => {
  let modelMock: ModelMock;
  let userClientMock: UserClientMock;
  let service: SensorsDataService;
  let model: Model<Data>;
  let client: ClientProxy;

  beforeEach(async () => {
    modelMock = new ModelMock();
    userClientMock = new UserClientMock({});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorsDataService,
        {
          provide: getModelToken('Data', 'sensors'),
          useValue: modelMock.build(),
        },
        {
          provide: 'USER_SERVICE',
          useValue: userClientMock.build(),
        },
      ],
    }).compile();

    service = module.get<SensorsDataService>(SensorsDataService);
    model = module.get<Model<Data>>(getModelToken('Data', 'sensors'));
    jest
      .spyOn(Document.prototype, 'toObject')
      .mockImplementation(() => ({}) as any);
    client = module.get<ClientProxy>('USER_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
    expect(client).toBeDefined();
  });

  describe('updateData', () => {
    it('should update single data if input payload is an object', async () => {
      // Arrange
      const stubData = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 1,
      };
      jest.spyOn(model, 'create').mockResolvedValueOnce(stubData as any);

      // Act & Assert
      expect(
        await service.updateData(
          stubData.metadata.deviceId,
          stubData.metadata.topic,
          {
            timestamp: stubData.timestamp.toTimeString(),
            value: stubData.value,
          },
        ),
      ).toEqual([
        {
          timestamp: stubData.timestamp.toISOString(),
          value: stubData.value,
        },
      ]);
    });

    it('should update single data if input payload is an object (no timestamp)', async () => {
      // Arrange
      const stubData = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 1,
      };
      jest.spyOn(model, 'create').mockResolvedValueOnce(stubData as any);

      // Act
      const result = await service.updateData(
        stubData.metadata.deviceId,
        stubData.metadata.topic,
        {
          value: stubData.value,
        },
      );

      // Assert
      expect(result[0].value).toEqual(stubData.value);
      expect(new Date(result[0].timestamp).getTime()).toBeGreaterThanOrEqual(
        stubData.timestamp.getTime(),
      );
    });

    it('should update single data if input payload is an object (unix timestamp)', async () => {
      // Arrange
      const stubData = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 1,
      };
      jest.spyOn(model, 'create').mockResolvedValueOnce(stubData as any);

      // Act & Assert
      expect(
        await service.updateData(
          stubData.metadata.deviceId,
          stubData.metadata.topic,
          {
            timestamp: stubData.timestamp.getTime(),
            value: stubData.value,
          },
        ),
      ).toEqual([
        {
          timestamp: stubData.timestamp.toISOString(),
          value: stubData.value,
        },
      ]);
    });

    it('should update single data if input values is an array with a single object', async () => {
      // Arrange
      const stubData = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 2,
      };
      jest.spyOn(model, 'create').mockResolvedValueOnce(stubData as any);

      // Act & Assert
      expect(
        await service.updateData(
          stubData.metadata.deviceId,
          stubData.metadata.topic,
          [
            {
              timestamp: stubData.timestamp.toISOString(),
              value: stubData.value,
            },
          ],
        ),
      ).toEqual([
        {
          timestamp: stubData.timestamp.toISOString(),
          value: stubData.value,
        },
      ]);
    });

    it('should update single data if input values is an array with a single object (no timestamp)', async () => {
      // Arrange
      const stubData = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 2,
      };
      jest.spyOn(model, 'create').mockResolvedValueOnce(stubData as any);

      // Act
      const result = await service.updateData(
        stubData.metadata.deviceId,
        stubData.metadata.topic,
        [
          {
            value: stubData.value,
          },
        ],
      );

      // Assert
      expect(result[0].value).toEqual(stubData.value);
      expect(new Date(result[0].timestamp).getTime()).toBeGreaterThanOrEqual(
        stubData.timestamp.getTime(),
      );
    });

    it('should update single data if input values is an array with a single object (unix timestamp)', async () => {
      // Arrange
      const stubData = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 2,
      };
      jest.spyOn(model, 'create').mockResolvedValueOnce(stubData as any);

      // Act & Assert
      expect(
        await service.updateData(
          stubData.metadata.deviceId,
          stubData.metadata.topic,
          [
            {
              timestamp: stubData.timestamp.getTime(),
              value: stubData.value,
            },
          ],
        ),
      ).toEqual([
        {
          timestamp: stubData.timestamp.toISOString(),
          value: stubData.value,
        },
      ]);
    });

    it('should update multiple data if input values is an array with multiple objects', async () => {
      // Arrange
      const stubData1 = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 2,
      };
      const stubData2 = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 3,
      };
      const stubDatas = [stubData1, stubData2];
      jest.spyOn(model, 'insertMany').mockResolvedValueOnce(stubDatas as any);

      // Act & Assert
      expect(
        await service.updateData(
          stubData1.metadata.deviceId,
          stubData1.metadata.topic,
          [
            {
              timestamp: stubData1.timestamp.toISOString(),
              value: stubData1.value,
            },
            {
              timestamp: stubData2.timestamp.toISOString(),
              value: stubData2.value,
            },
          ],
        ),
      ).toEqual([
        {
          timestamp: stubData1.timestamp.toISOString(),
          value: stubData1.value,
        },
        {
          timestamp: stubData2.timestamp.toISOString(),
          value: stubData2.value,
        },
      ]);
    });

    it('should update multiple data if input values is an array with multiple objects (no timestamp)', async () => {
      // Arrange
      const stubData1 = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 2,
      };
      const stubData2 = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 3,
      };
      const stubDatas = [stubData1, stubData2];
      jest.spyOn(model, 'insertMany').mockResolvedValueOnce(stubDatas as any);

      // Act
      const result = await service.updateData(
        stubData1.metadata.deviceId,
        stubData1.metadata.topic,
        [
          {
            value: stubData1.value,
          },
          {
            value: stubData2.value,
          },
        ],
      );

      // Assert
      expect(result[0].value).toEqual(stubData1.value);
      expect(result[1].value).toEqual(stubData2.value);
      expect(new Date(result[0].timestamp).getTime()).toBeGreaterThanOrEqual(
        stubData1.timestamp.getTime(),
      );
      expect(new Date(result[1].timestamp).getTime()).toBeGreaterThanOrEqual(
        stubData2.timestamp.getTime(),
      );
    });

    it('should update multiple data if input values is an array with multiple objects (unix timestamp)', async () => {
      // Arrange
      const stubData1 = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 2,
      };
      const stubData2 = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 3,
      };
      const stubDatas = [stubData1, stubData2];
      jest.spyOn(model, 'insertMany').mockResolvedValueOnce(stubDatas as any);

      // Act & Assert
      expect(
        await service.updateData(
          stubData1.metadata.deviceId,
          stubData1.metadata.topic,
          [
            {
              timestamp: stubData1.timestamp.getTime(),
              value: stubData1.value,
            },
            {
              timestamp: stubData2.timestamp.getTime(),
              value: stubData2.value,
            },
          ],
        ),
      ).toEqual([
        {
          timestamp: stubData1.timestamp.toISOString(),
          value: stubData1.value,
        },
        {
          timestamp: stubData2.timestamp.toISOString(),
          value: stubData2.value,
        },
      ]);
    });
  });

  describe('getLatestData', () => {
    it('should return the lastest data', async () => {
      // Arrange
      const stubData = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 2,
      };
      modelMock.stubFindSortLimitExec = [stubData];

      // Act & Assert
      expect(
        await service.getLatestData(
          stubData.metadata.deviceId,
          stubData.metadata.topic,
        ),
      ).toEqual({
        timestamp: stubData.timestamp.toISOString(),
        value: stubData.value,
      });
    });

    it('should return the lastest data (unix timestamp)', async () => {
      // Arrange
      const stubData = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 2,
      };
      modelMock.stubFindSortLimitExec = [stubData];

      // Act & Assert
      expect(
        await service.getLatestData(
          stubData.metadata.deviceId,
          stubData.metadata.topic,
          true,
        ),
      ).toEqual({
        timestamp: stubData.timestamp.getTime(),
        value: stubData.value,
      });
    });

    it('should throw not found if no data found', async () => {
      // Arrange
      const stubData = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 2,
      };
      modelMock.stubFindSortLimitExec = [];

      // Act & Assert
      await expect(
        service.getLatestData(
          stubData.metadata.deviceId,
          stubData.metadata.topic,
        ),
      ).rejects.toThrow(
        new RpcException(new NotFoundException('No Latest Data Found')),
      );
    });
  });

  describe('getPeriodicData', () => {
    it('should return the data for the given time period', async () => {
      // Arrange
      const fromPastMin = 2;
      const toPastMin = 0;
      const fromDate = new Date(Date.now() - 60000 * fromPastMin);
      const toDate = new Date(Date.now() - 60000 * toPastMin);
      const stubData = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 2,
      };
      modelMock.stubFindSortExce = [stubData];

      // Act & Assert
      expect(
        await service.getPeriodicData(
          stubData.metadata.deviceId,
          stubData.metadata.topic,
          fromDate.toISOString(),
          toDate.toISOString(),
        ),
      ).toEqual([
        {
          timestamp: stubData.timestamp.toISOString(),
          value: stubData.value,
        },
      ]);
    });

    it('should return the data for the given time period (unix timestamp)', async () => {
      // Arrange
      const fromPastMin = 2;
      const toPastMin = 0;
      const fromDate = new Date(Date.now() - 60000 * fromPastMin);
      const toDate = new Date(Date.now() - 60000 * toPastMin);
      const stubData = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 2,
      };
      modelMock.stubFindSortExce = [stubData];

      // Act & Assert
      expect(
        await service.getPeriodicData(
          stubData.metadata.deviceId,
          stubData.metadata.topic,
          fromDate.toISOString(),
          toDate.toISOString(),
          true,
        ),
      ).toEqual([
        {
          timestamp: stubData.timestamp.getTime(),
          value: stubData.value,
        },
      ]);
    });

    it('should throw not found if no data found for the given time period', async () => {
      // Arrange
      const fromPastMin = 2;
      const toPastMin = 0;
      const fromDate = new Date(Date.now() - 60000 * fromPastMin);
      const toDate = new Date(Date.now() - 60000 * toPastMin);
      const stubData = {
        timestamp: new Date(),
        metadata: {
          deviceId: 1,
          topic: 'test',
        },
        value: 2,
      };
      modelMock.stubFindSortExce = [];

      // Act & Assert
      await expect(
        service.getPeriodicData(
          stubData.metadata.deviceId,
          stubData.metadata.topic,
          fromDate.toISOString(),
          toDate.toISOString(),
        ),
      ).rejects.toThrow(
        new RpcException(
          new NotFoundException('No Data Found From The Given Period'),
        ),
      );
    });
  });

  describe('checkDeviceTopic', () => {
    it('should not throw error if device topic is valid', async () => {
      // Arrange
      userClientMock.stubSendPipe = {};

      // Act & Assert
      expect(await service.checkDeviceTopic(1, 1, 'test')).toEqual({});
    });

    it('should throw rpc exception if device topic is invalid', async () => {
      // Arrange
      jest
        .spyOn(client, 'send')
        .mockImplementation(() =>
          throwError(() => new RpcException('Invalid Topic')),
        );

      // Act & Assert
      await expect(service.checkDeviceTopic(1, 1, 'test')).rejects.toThrow(
        new RpcException('Invalid Topic'),
      );
    });
  });
});
