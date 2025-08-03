import { sleep } from '../../sleep/sleep';

describe('sleep', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  it('should resolve after the specified time', async () => {
    const ms = 1000;
    const sleepPromise = sleep(ms);

    jest.advanceTimersByTime(ms);

    await expect(sleepPromise).resolves.toBeUndefined();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), ms);
  });

  it('should not wait when when: false is provided', async () => {
    const ms = 1000;
    const sleepPromise = sleep(ms, { when: false });

    expect(sleepPromise).resolves.toBeUndefined();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 0);
  });

  it('should wait when when: true is provided', async () => {
    const ms = 1000;
    const sleepPromise = sleep(ms, { when: true });

    jest.advanceTimersByTime(ms);

    await expect(sleepPromise).resolves.toBeUndefined();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), ms);
  });

  it('should handle multiple sleep calls', async () => {
    const ms1 = 1000;
    const ms2 = 2000;

    const sleepPromise1 = sleep(ms1);
    const sleepPromise2 = sleep(ms2);

    jest.advanceTimersByTime(ms2);

    await Promise.all([expect(sleepPromise1).resolves.toBeUndefined(), expect(sleepPromise2).resolves.toBeUndefined()]);

    expect(setTimeout).toHaveBeenCalledTimes(2);
  });
});
