import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MonthlyRewards, {fetchDataMonthlyData} from '../components/MonthlyRewards';
import { handleFetchData } from '../fetchdata';
import { act } from 'react';  // Change this to import act from react


// Mock the handleFetchData function
jest.mock('../fetchdata', () => ({
  handleFetchData: jest.fn(),
}));
describe('MonthlyRewards Component', () => {
  it('fetches and displays rewards data', async () => {
    // Mock data to be returned by the API call
    const mockData = [
      { customerId: '1', customerName: 'John Doe', purchaseDate: '01/01/2025', rewardsPoints: 100 },
      { customerId: '2', customerName: 'Jane Smith', purchaseDate: '01/01/2025', rewardsPoints: 150 },
    ];
  
    // Mock handleFetchData to return the mock data
    handleFetchData.mockResolvedValueOnce(mockData);
  
    // Render the component
    render(<MonthlyRewards />);
  
    // Wait for the content to appear on the screen (can be used for a single assertion)
    await waitFor(() => screen.findByText('John Doe'));
  
    // Assert each piece of data separately
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('shows loading spinner initially', () => {
    // Mocking the response to return data after a delay
    handleFetchData.mockResolvedValueOnce([]);
    
    render(<MonthlyRewards />);
    
    // Check that the loading spinner is present when the component is loading
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Loading...');
  });

  it('shows error message when fetching data fails', async () => {
    // Mock handleFetchData to reject with an error message
    handleFetchData.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<MonthlyRewards />);

    // Wait for the error message to appear
    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Error: Something went wrong');
    });
  });

  it('displays table when data is fetched successfully', async () => {
    // Mock the API response to return some sample data
    handleFetchData.mockResolvedValueOnce([
      { customerId: 1, customerName: 'Alice', purchaseDate: '01/01/2021', rewardsPoints: 250 },
      { customerId: 2, customerName: 'Bob', purchaseDate: '01/01/2021', rewardsPoints: 200 }
    ]);
  
    render(<MonthlyRewards />);
  
    // Wait for the loading spinner to disappear
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();  // Loading spinner should be gone
    });
  
    // Ensure the data is displayed in the table
    expect(screen.getByText('User Monthly Rewards')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('handles empty dataset gracefully', async () => {
    // Mock the response to return an empty array
    handleFetchData.mockResolvedValueOnce([]);
  
    render(<MonthlyRewards />);
  
    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();  // Ensure loading spinner disappears
    });
  
    // Ensure the heading 'User Monthly Rewards' is displayed
    expect(screen.getByText('User Monthly Rewards')).toBeInTheDocument();
    
    // Ensure no table is rendered when there is no data
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
