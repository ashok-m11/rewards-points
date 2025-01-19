
const calculatePoints = (amount) => {
    if (amount <= 50) {
      return 0;
    } else if (amount > 50 && amount <= 100) {
      return amount - 50;
    } else {
      const pointsAbove100 = (amount - 100) * 2;
      const pointsBetween50And100 = 50;
      return pointsAbove100 + pointsBetween50And100;
    }
  };

 export const handleFetchData = async () => {
   const url = "http://localhost:5000/transactions";
    try {
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        data.map((d) => {
          return (d.rewardsPoints = parseInt(calculatePoints(d.price)));
        });
        const sortData = data.sort(
          (a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate)
        );
        return sortData;
      } else {
        return {error:"Failed to load response data"};
      }
    } catch (error) {
      return {error:"Failed to load response data"};
    } 
  };