// Test setup file
import { jest } from '@jest/globals';

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock fetch for API tests
global.fetch = jest.fn();

// Mock WebSocket for WebSocket tests
global.WebSocket = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
  readyState: 1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
}));

// Mock URL for URL constructor tests
global.URL = jest.fn().mockImplementation((url: string) => ({
  href: url,
  searchParams: new URLSearchParams(url.split('?')[1] || ''),
}));

// Mock URLSearchParams
global.URLSearchParams = URLSearchParams;
