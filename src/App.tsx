import { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { CompareProvider } from './context/CompareContext';

// Layout Components
import Sidebar from './components/common/layout/Sidebar';

// Pages
import Hero from './pages/Hero';
import Home from './pages/Home';
import Explorer from './pages/Explorer';
import Compare from './pages/Compare';
import Ranking from './pages/Ranking';
import Predict from './pages/Predict';
import Assistant from './pages/Assistant';

function App() {
  const [isLaunched, setIsLaunched] = useState(false);

  // Show the landing page first
  if (!isLaunched) {
    return <Hero onLaunchScreener={() => setIsLaunched(true)} />;
  }

  // Once launched, show the full app layout wrapped in global state
  return (
    <CompareProvider>
      <BrowserRouter>
        <div className="flex h-screen w-screen bg-[#000000] overflow-hidden text-white font-sans">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/predict" element={<Predict />} />
              <Route path="/assistant" element={<Assistant />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </CompareProvider>
  );
}

export default App;