let whatsappSendMock: jest.Mock;
let whatsappToMock: jest.Mock;
let whatsappMessageMock: jest.Mock;

jest.mock('@shared/domain', () => ({
  Whatsapp: {
    get message() {
      return whatsappMessageMock;
    },
  },
}));

import { WhatsappSender } from '../whatsapp.sender';
import { Template } from '../template';

describe('WhatsappSender', () => {
  let templateMock: Template;

  beforeEach(() => {
    whatsappSendMock = jest.fn();
    whatsappToMock = jest.fn(() => ({ send: whatsappSendMock }));
    whatsappMessageMock = jest.fn(() => ({ to: whatsappToMock }));

    templateMock = {
      toString: jest.fn(() => 'test message'),
      payer: { phone: '+123456789' },
    } as any;
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should send the message using Whatsapp.message().to().send()', () => {
    const sender = WhatsappSender.create(templateMock);
    sender.send();
    expect(templateMock.toString).toHaveBeenCalled();
    expect(whatsappMessageMock).toHaveBeenCalledWith('test message');
    expect(whatsappToMock).toHaveBeenCalledWith('+123456789');
    expect(whatsappSendMock).toHaveBeenCalled();
  });

  it('should create an instance with the static create() method', () => {
    const sender = WhatsappSender.create(templateMock);
    expect(sender).toBeInstanceOf(WhatsappSender);
  });
});
