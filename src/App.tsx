import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Cart from './components/Cart';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
};

export default App;