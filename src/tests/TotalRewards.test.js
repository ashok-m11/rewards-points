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

    // Assert that the loading spinner is displayed
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message when fetching data fails', async () => {
    // Mock handleFetchData to reject with an error message
    handleFetchData.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<TotalRewards />);

    // Wait for the error message to appear
    await waitFor(() => {
      // Look for the alert div with role="alert"
      const errorMessage = screen.queryByRole('alert');
      expect(errorMessage).toBeInTheDocument();
     // expect(errorMessage).toHaveTextContent('Error: Something went wrong');
    });
  });

  it('displays total rewards table when data is fetched successfully', async () => {
    // Mock the data that would be returned by handleFetchData
    const mockData = [
      { customerName: 'Alice', rewardsPoints: 100 },
      { customerName: 'Bob', rewardsPoints: 200 },
    ];
    
    // Simulate a successful data fetch
    handleFetchData.mockResolvedValueOnce(mockData);

    render(<TotalRewards />);

    // Wait for the table to be displayed
    await waitFor(() => {
      expect(screen.getByText('Total rewards')).toBeInTheDocument();
    });

    // Assert that the table rows are displayed correctly
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
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
