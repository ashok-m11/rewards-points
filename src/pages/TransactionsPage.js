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

// Helper component for conditional rendering
const DataOrNoData = ({ data, noDataMessage, Component, componentProps }) => {
  return data.length === 0 ? (
    <p>{noDataMessage}</p>
  ) : (
    <Component {...componentProps} />
  );
};

function TransactionsPage() {
  const [dataSet, setDataSet] = useState([]);
  const [rewardsData, setRewardsData] = useState({
    totalRewards: [],
    monthlyRewards: [],
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = useCallback((value) => {
    setSelectedRow(value);
  }, []);

  const fetchDataTransactions = useCallback(async () => {
    try {
      const data = await handleFetchData();

      if (data.error) {
        Logger.warn(data.error);
        setErrorMsg("Failed to load response data");
      } else {
        const transactions = transactionsWithPoints(data);
        setDataSet(transactions);

        const totalRewards = aggregateRewardsByCustomerUtil(transactions);
        const monthlyRewards = aggregateRewardsByMonthYear(transactions);

        setRewardsData({
          totalRewards,
          monthlyRewards,
        });
      }
    } catch (error) {
      Logger.error(`Failed to load response data: ${error.message}`);
      setErrorMsg("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataTransactions();
  }, [fetchDataTransactions]);

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
              <DataOrNoData
                data={rewardsData.monthlyRewards}
                noDataMessage="No data available"
                Component={MonthlyRewards}
                componentProps={{
                  selectedRow,
                  data: rewardsData.monthlyRewards,
                }}
              />
            </div>
            <div className="col-6">
              <h3 className="heading">Total rewards</h3>
              <DataOrNoData
                data={rewardsData.totalRewards}
                noDataMessage="No data available"
                Component={TotalRewards}
                componentProps={{
                  onRowClick: handleRowClick,
                  data: rewardsData.totalRewards,
                }}
              />
            </div>
            <div className="col-12">
              <h3 className="heading">Transactions</h3>
              <DataOrNoData
                data={dataSet}
                noDataMessage="No data available"
                Component={Transactions}
                componentProps={{ selectedRow, data: dataSet }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionsPage;
