import { of } from 'rxjs';

export class UserClientMock {
  stubSendPipe: any;

  constructor(stubSendPipe: any) {
    this.stubSendPipe = stubSendPipe;
  }

  build() {
    return {
      send: jest.fn().mockImplementation(() => ({
        pipe: jest.fn().mockImplementation(() => of(this.stubSendPipe)),
      })),
    };
  }
}
