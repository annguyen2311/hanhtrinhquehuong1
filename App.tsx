import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Trips from './pages/Trips';
import Auth from './pages/Auth';
import Assistant from './pages/Assistant';

// Error Boundary to catch runtime errors preventing White Screen
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Đã xảy ra lỗi!</h2>
            <p className="text-slate-600 mb-6">Xin lỗi, ứng dụng gặp sự cố không mong muốn. Vui lòng tải lại trang.</p>
            <div className="bg-slate-100 p-4 rounded-lg text-left text-xs font-mono text-red-500 overflow-auto max-h-40 mb-6">
               {this.state.error?.toString()}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/trips" element={<Trips />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/ai-planner" element={<Assistant />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
