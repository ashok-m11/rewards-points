import { useState, useEffect, useCallback } from "react";
import { handleFetchData } from "../services/fetchData";
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
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (value) => {
    setSelectedRow(value);
  };

  const fetchDataTransactions = useCallback(async () => {
    try {
      const data = await handleFetchData();

      if (data.error) {
        Logger.warn(data.error);
        setErrorMsg("Failed to load response data");
      } else {
        setDataSet(transactionsWithPoints(data));
        userTotalRewardsCount(transactionsWithPoints(data));
        prepareTableDataMonthly(transactionsWithPoints(data));
      }
    } catch (error) {
      const errorMsg = `Failed to load response data: ${error.message}`;
      Logger.error(errorMsg);
      setErrorMsg("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataTransactions();
  }, [fetchDataTransactions]);

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
      ) : errorMsg ? (
        <div className="alert alert-danger" role="alert">
          Error: {errorMsg}
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
