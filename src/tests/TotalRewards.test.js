import { render, screen, waitFor } from '@testing-library/react';
import TotalRewards from '../components/TotalRewards';
import { handleFetchData } from '../fetchdata';

// Mock the handleFetchData function
jest.mock('../fetchdata');

describe('TotalRewards Component', () => {
  it('shows loading spinner initially', () => {
    // Simulate loading state
    handleFetchData.mockResolvedValueOnce([]);

    render(<TotalRewards />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message when fetching data fails', async () => {
    // Mock the fetch function to return an error
    handleFetchData.mockRejectedValue(new Error('Failed to fetch'));

    render(<TotalRewards />);

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  it('displays total rewards table when data is fetched successfully', async () => {
    // Mock the data that would be returned by handleFetchData
    const mockData = [
      { customerId: '1', customerName: 'Alice', rewardsPoints: 300 },
      { customerId: '2', customerName: 'Bob', rewardsPoints: 200 },
    ];
    
    // Mock the fetch function to return mockData
    handleFetchData.mockResolvedValue(mockData);

    render(<TotalRewards />);

    // Wait for the table to be displayed
    await waitFor(() => {
      expect(screen.getByText('Data Loaded')).toBeInTheDocument();
    });

    // Check if the data is displayed correctly
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('handles empty dataset gracefully', async () => {
    // Simulate an empty dataset
    handleFetchData.mockResolvedValueOnce([]);

    render(<TotalRewards />);

    // Wait for the table to be rendered
    await waitFor(() => {
      expect(screen.queryByText('Total rewards')).not.toBeInTheDocument();
    });

    // Optionally check for a message when no data is present
    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
  });
});
