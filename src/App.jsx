import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Integration from './pages/Integration';
import Hub from './pages/Hub';
import ToplineForecast from './pages/ToplineForecast';
import Headcount from './pages/Headcount';
import NonHeadcount from './pages/NonHeadcount';
import Infrastructure from './pages/Infrastructure';
import EquityComp from './pages/EquityComp';
import SalesOps from './pages/SalesOps';

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/integration" element={<Integration />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/topline" element={<ToplineForecast />} />
          <Route path="/headcount" element={<Headcount />} />
          <Route path="/non-headcount" element={<NonHeadcount />} />
          <Route path="/infrastructure" element={<Infrastructure />} />
          <Route path="/equity" element={<EquityComp />} />
          <Route path="/sales-ops" element={<SalesOps />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
