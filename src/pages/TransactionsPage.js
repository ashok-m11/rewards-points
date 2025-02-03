import { useState, useEffect } from "react";
import { handleFetchData } from "../services/fetchData";
import { calculatePoints } from "../utils/utils";
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
  console.log("selected row", selectedRow);

  const fetchDataTransactions = async () => {
    try {
      const data = await handleFetchData();

      if (data.error) {
        Logger.warn(data.error);
        setError("Failed to load response data");
      } else {
        const monthsToDisplay = 3;
        const today = new Date();
        const threeMonthsAgo = new Date(
          today.setMonth(today.getMonth() - monthsToDisplay)
        );

        const parseDate = (dateStr) => {
          const [day, month, year] = dateStr.split("/");
          return new Date(`${month}/${day}/${year}`);
        };

        const transactionsWithPoints = data
          .filter((transaction) => {
            const purchaseDate = parseDate(transaction.purchaseDate);
            const flooredPrice = Math.floor(transaction.price);
            return (
              !isNaN(transaction.price) &&
              Number.isFinite(transaction.price) &&
              flooredPrice >= 50 &&
              purchaseDate >= threeMonthsAgo
            );
          })
          .map((transaction) => {
            const flooredPrice = Math.floor(transaction.price);
            return {
              ...transaction,
              rewardsPoints: calculatePoints(flooredPrice),
            };
          })
          .sort((a, b) => {
            const dateA = parseDate(a.purchaseDate);
            const dateB = parseDate(b.purchaseDate);
            return dateA - dateB;
          });

        setDataSet(transactionsWithPoints);
        userTotalRewardsCount(transactionsWithPoints);
        prepareTableDataMonthly(transactionsWithPoints);
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

  const userTotalRewardsCount = (data) => {
    const groupedData = data?.reduce((acc, item) => {
      if (!acc[item?.customerId]) {
        acc[item?.customerId] = {
          customerName: item?.customerName,
          rewardsPoints: 0,
        };
      }
      acc[item?.customerId].rewardsPoints += item?.rewardsPoints;
      return acc;
    }, {});

    const result = Object.entries(groupedData).map(
      ([customerId, { customerName, rewardsPoints }]) => ({
        customerId,
        customerName,
        rewardsPoints,
      })
    );

    setTotalRewards(result);
  };

  const aggregateRewardsByMonthYear = (transactions) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return Object.entries(
      transactions.reduce((acc, transaction) => {
        const { customerId, customerName, purchaseDate, rewardsPoints } =
          transaction;
        const [day, month, year] = purchaseDate.split("/");
        const key = `${customerId}-${month}-${year}`;
        const monthName = monthNames[parseInt(month) - 1];

        if (!acc[key]) {
          acc[key] = {
            customerId,
            customerName,
            month: monthName,
            year,
            rewardsPoints: 0,
          };
        }
        acc[key].rewardsPoints += rewardsPoints;
        return acc;
      }, {})
    );
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
                <p>No data available </p>
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
