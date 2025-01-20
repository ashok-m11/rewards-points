### `npm install`
To install all required packages

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npx json-server --watch ./src/data.json --port 5000`
Runs the API server with port number 5000
http://localhost:5000/transactions
This is the API to fetch the data.


fetchData.js which contains fetch API data and laos reward points logic.

### Under src/components folder below are the components
MonthlyRewards.js component contains users monthly rewards
This table contains for each custmer id Total Rewards for each month

TotalRewards.js component contains Total Reward Points per user
This table contains Total rewards of each customer id

Transactions.js component contains All transactions with reward points
This table contans all transactions and reward calculations



### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
