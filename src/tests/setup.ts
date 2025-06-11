// Jest setup file for video processing tests

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock fetch for API tests
global.fetch = jest.fn();

// Mock file system operations
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    stat: jest.fn(),
    open: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
  constants: {
    F_OK: 0,
    R_OK: 4,
    W_OK: 2,
  },
}));

// Mock path operations
jest.mock('path', () => ({
  extname: jest.fn(),
  basename: jest.fn(),
  dirname: jest.fn(),
  join: jest.fn(),
  normalize: jest.fn(),
}));

// Setup test environment
beforeEach(() => {
  jest.clearAllMocks();
});

// Cleanup after tests
afterEach(() => {
  jest.restoreAllMocks();
});