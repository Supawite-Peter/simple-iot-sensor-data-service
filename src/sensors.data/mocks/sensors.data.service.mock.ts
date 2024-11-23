export class ServiceMock {
  build() {
    return {
      updateData: jest.fn().mockResolvedValue('Update Data Received'),
      getLatestData: jest.fn().mockResolvedValue('Get Latest Data Received'),
      getPeriodicData: jest
        .fn()
        .mockResolvedValue('Get Periodic Data Received'),
      checkDeviceTopic: jest.fn().mockResolvedValue({}),
    };
  }
}
