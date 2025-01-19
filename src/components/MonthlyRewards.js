import { useEffect, useState } from "react";
import { handleFetchData } from "../fetchdata";

function MonthlyRewards() {
  const [dataSet, setDataSet] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);


 const fetchDataMonthlyData = async () => {
    try {
      const res = await handleFetchData();
      return !res.error ? prepareTableData(res) : setError(res.error);
    } catch (error) {
      console.error(error); // Add logging here
      setError('Something went wrong');
      return { error: 'Something went wrong' };
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDataMonthlyData();
  },[]);

  const aggregateRewardsByMonthYear = (transactions)=>{
    return Object.entries(
        transactions.reduce((acc, transaction)=>{
            const{customerId, customerName, purchaseDate, rewardsPoints} = transaction;
            const[day, month, year] = purchaseDate.split("/");
            const key = `${customerId}-${month}-${year}`;
            if(!acc[key]){
                acc[key] = {
                    customerId, customerName, month, year, rewardsPoints:0,
                };
            }
            acc[key].rewardsPoints += rewardsPoints
           
            
            return acc;
        }, {})
    )
  }

  const prepareTableData = (transactions) =>{
    const aggregatedData = aggregateRewardsByMonthYear(transactions);
       setDataSet(aggregatedData);
    
  }

  return (
    <div>
      {isLoading && <div role="status" aria-live="polite">Loading...</div>}
      {error && <div className="alert alert-danger" role="alert">Error: {error}</div>}
      
      <h3 className="heading">User Monthly Rewards</h3> {/* Heading always displayed */}

      {dataSet.length > 0 ? (
        <table className="table table-hover table-sm caption-top">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Customer Id</th>
              <th scope="col">Customer Name</th>
              <th scope="col">Month</th>
              <th scope="col">Year</th>
              <th scope="col" className="text-end">Reward Points</th>
            </tr>
          </thead>
          <tbody>
            {dataSet?.map((data) => (
              <tr key={data[1]?.customerId}>
                <td>{data[1]?.customerId}</td>
                <td>{data[1]?.customerName}</td>
                <td>{data[1]?.month}</td>
                <td>{data[1]?.year}</td>
                <td className="text-end">{data[1]?.rewardsPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p> // Display when there's no data
      )}
    </div>
  );
}

export default MonthlyRewards;