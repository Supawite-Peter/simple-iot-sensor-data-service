export class ModelMock {
  stubFindSortExce: any;
  stubFindSortLimitExec: any;
  constructor(stubFindSortExce: any = [], stubFindSortLimitExec: any = []) {
    this.stubFindSortExce = stubFindSortExce;
    this.stubFindSortLimitExec = stubFindSortLimitExec;
  }

  build() {
    return {
      find: jest.fn().mockImplementation(() => ({
        sort: jest.fn().mockImplementation(() => ({
          limit: jest.fn().mockImplementation(() => ({
            exec: jest
              .fn()
              .mockImplementation(() =>
                Promise.resolve(this.stubFindSortLimitExec),
              ),
          })),
          exec: jest
            .fn()
            .mockImplementation(() => Promise.resolve(this.stubFindSortExce)),
        })),
      })),
      create: jest.fn().mockResolvedValue({}),
      insertMany: jest.fn().mockResolvedValue([]),
      sort: jest.fn().mockResolvedValue([]),
    };
  }
}
