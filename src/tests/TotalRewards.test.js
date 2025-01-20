import { render, screen, waitFor } from '@testing-library/react';
import { handleFetchData } from '../fetchdata'; // Adjust path based on your structure
import TotalRewards from '../components/TotalRewards';
import '@testing-library/jest-dom'; // For better matchers like toBeInTheDocument()

// Mock the fetch function
jest.mock('../fetchdata'); // Mock handleFetchData

describe('TotalRewards Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('displays loading state initially', () => {
    render(<TotalRewards />);

    // Check that the loading text is present initially
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  it('displays error message when data fetching fails', async () => {
    // Mock handleFetchData to simulate an error
    handleFetchData.mockResolvedValueOnce({ error: 'Something went wrong' });

    render(<TotalRewards />);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Error: Something went wrong');
    });
  });

  it('displays total rewards table when data is fetched successfully', async () => {
    // Mock handleFetchData to return data
    const mockData = [
      { customerName: 'Alice', rewardsPoints: 300, customerId: 1 },
      { customerName: 'Bob', rewardsPoints: 200, customerId: 2 },
    ];
    handleFetchData.mockResolvedValueOnce(mockData);

    render(<TotalRewards />);

    // Wait for the table to appear and ensure data is rendered
    expect(await screen.findByText('Customer Name')).toBeInTheDocument();
  expect(await screen.findByText('Alice')).toBeInTheDocument();
  expect(await screen.findByText('Bob')).toBeInTheDocument();
  expect(await screen.findByText('300')).toBeInTheDocument();
  expect(await screen.findByText('200')).toBeInTheDocument();
  });

  it('displays "No data available" when there is no data', async () => {
    // Mock handleFetchData to return an empty array (no data)
    handleFetchData.mockResolvedValueOnce([]);

    render(<TotalRewards />);

    // Wait for the "No data available" text to appear
    await waitFor(() => {
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });
});
