// TransactionsPage.js
import { useState, useEffect } from "react";
import { handleFetchData } from "../services/fetchData"; // Assuming this is fetching data
import {
  aggregateRewardsByCustomerUtil,
  aggregateRewardsByMonthYear,
  transactionsWithPoints,
} from "../utils/utils";
import Transactions from "../components/Transactions";
import TotalRewards from "../components/TotalRewards";
import MonthlyRewards from "../components/MonthlyRewards";
import Logger from "../utils/logger";

function TransactionsPage() {
  const [dataSet, setDataSet] = useState([]);
  const [totalRewards, setTotalRewards] = useState([]);
  const [monthlyRewards, setMonthlyRewards] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (value) => {
    setSelectedRow(value);
  };

  const fetchDataTransactions = async () => {
    try {
      const data = await handleFetchData();

      if (data.error) {
        Logger.warn(data.error);
        setError("Failed to load response data");
      } else {
        setDataSet(transactionsWithPoints(data));
        userTotalRewardsCount(transactionsWithPoints(data));
        prepareTableDataMonthly(transactionsWithPoints(data));
      }
    } catch (error) {
      const errorMsg = `Failed to load response data: ${error.message}`;
      Logger.error(errorMsg);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataTransactions();
  }, []);

  // Prepare total rewards to pass to TotalRewards component
  const userTotalRewardsCount = (data) => {
    setTotalRewards(aggregateRewardsByCustomerUtil(data));
  };

  const prepareTableDataMonthly = (transactions) => {
    const aggregatedData = aggregateRewardsByMonthYear(transactions);
    setMonthlyRewards(aggregatedData);
  };

  return (
    <div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          Loading...
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-6">
              <h3 className="heading">User Monthly Rewards</h3>
              {monthlyRewards.length === 0 ? (
                <p>No data available</p>
              ) : (
                <MonthlyRewards
                  selectedRow={selectedRow}
                  data={monthlyRewards}
                />
              )}
            </div>
            <div className="col-6">
              <h3 className="heading">Total rewards</h3>
              {totalRewards.length === 0 ? (
                <p>No data available</p>
              ) : (
                <TotalRewards onRowClick={handleRowClick} data={totalRewards} />
              )}
            </div>
            <div className="col-12">
              <h3 className="heading">Transactions</h3>
              {dataSet.length === 0 ? (
                <p>No data available</p>
              ) : (
                <Transactions selectedRow={selectedRow} data={dataSet} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionsPage;
