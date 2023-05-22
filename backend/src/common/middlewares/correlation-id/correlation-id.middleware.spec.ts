import { CorrelationIdMiddleware } from './correlation-id.middleware';

describe('CorrelationIdMiddleware', () => {
  it('should be defined', () => {
    expect(new CorrelationIdMiddleware()).toBeDefined();
  });
});
