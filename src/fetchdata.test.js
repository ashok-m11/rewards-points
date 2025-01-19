import { handleFetchData } from "./fetchdata";

// Mock the `calculatePoints` function if needed
jest.mock('./fetchData', () => ({
  ...jest.requireActual('./fetchData'),
  calculatePoints: jest.fn(),
}));

describe('handleFetchData', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('calculates rewards points correctly for an amount <= 50', async () => {
   
    const mockResponse = [
      { transactionId: 1, price: 30, purchaseDate: '2023-01-01', customerName: 'Alice' },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await handleFetchData();
    expect(result[0].rewardsPoints).toBe(0);
  });

  it('calculates rewards points correctly for an amount between 50 and 100', async () => {
    // Mocking the `calculatePoints` function for an amount of 75
       const mockResponse = [
      { transactionId: 1, price: 75, purchaseDate: '2023-01-01', customerName: 'Alice' },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await handleFetchData();
    expect(result[0].rewardsPoints).toBe(25);
  });

  it('calculates rewards points correctly for an amount > 100', async () => {
    // Mocking the `calculatePoints` function for an amount of 150
    
    const mockResponse = [
      { transactionId: 1, price: 150, purchaseDate: '2023-01-01', customerName: 'Alice' },
    ];
  
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );
  
    const result = await handleFetchData();
    expect(result[0].rewardsPoints).toBe(150); // Correct expected value
  });

  it('returns sorted data by purchase date', async () => {
    const mockResponse = [
      { transactionId: 1, price: 100, purchaseDate: '2023-01-02', customerName: 'Alice' },
      { transactionId: 2, price: 200, purchaseDate: '2023-01-01', customerName: 'Bob' },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    );

    const result = await handleFetchData();
    expect(result[0].transactionId).toBe(2); // Bob's transaction should come first
    expect(result[1].transactionId).toBe(1); // Alice's transaction should come second
  });

  it('returns an error if fetch fails', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Failed to fetch')));

    const result = await handleFetchData();
    expect(result).toEqual({ error: 'Failed to load response data' });
  });

  it('returns an error if the response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    );

    const result = await handleFetchData();
    expect(result).toEqual({ error: 'Failed to load response data' });
  });
});
