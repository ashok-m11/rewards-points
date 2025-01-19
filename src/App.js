import Transactions from './components/Transactions';
import TotalRewards from './components/TotalRewards';
import MonthlyRewards from './components/MonthlyRewards';
import './App.css';

function App() {
  
  
  
  return (
    
    <div class="container">

    <div class="row">
  
      <div class="col-6"> <MonthlyRewards /></div>
  
      <div class="col-6"> <TotalRewards />  </div>
  
      <div class="col-12">  <Transactions />  </div>
  
    </div>
  
  </div>
  );
}

export default App;
