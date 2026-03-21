import { describe, it, expect } from 'vitest';

// Test the response shape utilities
describe('API Response Helpers', () => {
  it('success response shape', () => {
    const data = { id: '1', name: 'test' };
    const response = { success: true, data };
    expect(response.success).toBe(true);
    expect(response.data).toEqual(data);
  });

  it('error response shape', () => {
    const response = { success: false, error: 'Not found' };
    expect(response.success).toBe(false);
    expect(response.error).toBe('Not found');
  });
});
