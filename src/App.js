import "./App.css";
import GeneratePCN from "../src/components/pages/GeneratePCN/GeneratePCN";
import Login from "../src/components/pages/Login/Login";
import { Routes, Route } from 'react-router-dom';
import VerifyPCN from "../src/components/pages/VerifyPCN/VerifyPCN";
import RemovePCN from "../src/components/pages/RemovePCN/RemovePCN";
import PCNList from "../src/components/pages/PCNList/PCNList";
import PageNotFound from "../src/components/pages/PageNotFound/PageNotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pcn-generator" element={<GeneratePCN />} />
        <Route path="/verify-pcn" element={<VerifyPCN />} />
        <Route path="/remove-pcn" element={<RemovePCN />} /> 
        <Route path="/get-all-pcn" element={<PCNList />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;