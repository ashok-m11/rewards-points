import { useEffect, useState, useCallback } from "react";
import { handleFetchData } from "../fetchdata";

function TotalRewards() {
  const [dataSet, setDataSet] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

   // Define fetchData with useCallback to avoid unnecessary re-creations
   const fetchData = useCallback(async () => {
    try {
      const res = await handleFetchData();
      return !res.error ? aggregateData(res) : setError(res.error);
    } catch (error) {
      console.error(error); // Add logging here
      setError('Something went wrong');
      return { error: 'Something went wrong' };
    } finally {
      setIsLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  const aggregateData = (data) => {
    const groupedData = data?.reduce((acc, item) => {
      if (!acc[item?.customerId]) {
        acc[item?.customerId] = { customerName: item?.customerName, rewardsPoints: 0 };
      }
      acc[item?.customerId].rewardsPoints += item?.rewardsPoints;
      return acc;
    }, {});
    
    const result = Object.entries(groupedData).map(([customerId, { customerName, rewardsPoints }]) => ({
      customerId, customerName, rewardsPoints
    }));

    setDataSet(result);
  };

 
  
  return (
    <div>
      
      {isLoading ? <p>Loading...</p> : error ? <p>{error}</p> : <p>Data Loaded</p>}
{
dataSet.length && 
<>
      <h3 className="heading">Total rewards</h3>
      <table className="table  table-hover table-sm caption-top">
      
        <thead className="thead-dark">
          <tr>
            
            <th scope="col">Customer Name</th>
            
            <th scope="col" className="text-end">Reward Points</th>
          </tr>
        </thead>
        <tbody>
          {dataSet?.map((data) => (
            <tr key={data.customerName}>
              
              <td>{data.customerName}</td>
             
              <td className="text-end">{data.rewardsPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
}
    </div>
  );

}

export default TotalRewards;
