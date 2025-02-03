import Logger from "../utils/logger";

export const handleFetchData = async () => {
  const url = "/data.json";
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      Logger.info(`Successfully fetched data from ${url}`);
      return data.transactions || []; // Ensure it returns an empty array if no transactions
    } else {
      const errorMessage = "Failed to load response data";
      Logger.warn(
        `${errorMessage}: ${response.status} - ${response.statusText}`
      );
      return []; // Return an empty array instead of an error object
    }
  } catch (error) {
    const errorMessage = "Failed to load response data";
    Logger.error(`${errorMessage}: ${error.message}`);
    return []; // Return an empty array in case of a network error
  }
};
