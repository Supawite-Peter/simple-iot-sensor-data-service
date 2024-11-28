import { Test, TestingModule } from '@nestjs/testing';
import { SensorsDataController } from './sensors.data.controller';
import { SensorsDataService } from './sensors.data.service';
import { ServiceMock } from './mocks/sensors.data.service.mock';

describe('SensorsDataController', () => {
  let serviceMock: ServiceMock;
  let controller: SensorsDataController;
  let service: SensorsDataService;

  beforeEach(async () => {
    serviceMock = new ServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SensorsDataController],
    })
      .useMocker((token) => {
        switch (token) {
          case SensorsDataService:
            return serviceMock.build();
        }
      })
      .compile();

    controller = module.get<SensorsDataController>(SensorsDataController);
    service = module.get<SensorsDataService>(SensorsDataService);
  });

  it('should be define', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('sensors.data.update', () => {
    it('should check device topic and pass data to service.updateData', async () => {
      // Arrange
      const input = {
        userId: 1,
        deviceId: 1,
        deviceTopic: 'topic1',
        dataPayload: {
          timestamp: Date.now(),
          value: 1,
        },
      };

      // Act & Assert
      expect(await controller.updateData(input)).toEqual(
        'Update Data Received',
      );
      expect(service.checkDeviceTopic).toHaveBeenCalled();
      expect(service.updateData).toHaveBeenCalled();
    });

    it('should stop execution if check device topic fails', async () => {
      // Arrange
      const input = {
        userId: 1,
        deviceId: 1,
        deviceTopic: 'topic1',
        dataPayload: {
          timestamp: Date.now(),
          value: 1,
        },
      };
      jest
        .spyOn(service, 'checkDeviceTopic')
        .mockRejectedValueOnce(new Error('Invalid Topic'));

      // Act & Assert
      await expect(controller.updateData(input)).rejects.toThrow(
        new Error('Invalid Topic'),
      );
      expect(service.checkDeviceTopic).toHaveBeenCalled();
      expect(service.updateData).not.toHaveBeenCalled();
    });
  });

  describe('sensors.data.get.latest', () => {
    it('should check device topic and pass data to service.getLatestData', async () => {
      // Arrange
      const input = {
        userId: 1,
        deviceId: 1,
        deviceTopic: 'topic1',
      };

      // Act & Assert
      expect(await controller.getLatestData(input)).toEqual(
        'Get Latest Data Received',
      );
      expect(service.checkDeviceTopic).toHaveBeenCalled();
      expect(service.getLatestData).toHaveBeenCalled();
    });

    it('should stop execution if check device topic fails', async () => {
      // Arrange
      const input = {
        userId: 1,
        deviceId: 1,
        deviceTopic: 'topic1',
      };
      jest
        .spyOn(service, 'checkDeviceTopic')
        .mockRejectedValueOnce(new Error('Invalid Topic'));

      // Act & Assert
      await expect(controller.getLatestData(input)).rejects.toThrow(
        new Error('Invalid Topic'),
      );
      expect(service.checkDeviceTopic).toHaveBeenCalled();
      expect(service.getLatestData).not.toHaveBeenCalled();
    });
  });

  describe('sensors.data.get.periodic', () => {
    it('should check device topic and pass data to service.getPeriodicData', async () => {
      // Arrange
      const input = {
        userId: 1,
        deviceId: 1,
        deviceTopic: 'topic1',
        from: Date.now() - 10000,
        to: Date.now(),
      };

      // Act & Assert
      expect(await controller.getPeriodicData(input)).toEqual(
        'Get Periodic Data Received',
      );
      expect(service.checkDeviceTopic).toHaveBeenCalled();
      expect(service.getPeriodicData).toHaveBeenCalled();
    });

    it('should stop execution if check device topic fails', async () => {
      // Arrange
      const input = {
        userId: 1,
        deviceId: 1,
        deviceTopic: 'topic1',
        from: Date.now() - 10000,
        to: Date.now(),
      };
      jest
        .spyOn(service, 'checkDeviceTopic')
        .mockRejectedValueOnce(new Error('Invalid Topic'));

      // Act & Assert
      await expect(controller.getPeriodicData(input)).rejects.toThrow(
        new Error('Invalid Topic'),
      );
      expect(service.checkDeviceTopic).toHaveBeenCalled();
      expect(service.getPeriodicData).not.toHaveBeenCalled();
    });
  });
});
