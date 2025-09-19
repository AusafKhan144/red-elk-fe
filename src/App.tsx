import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage'
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import Dashboard from './pages/Dashboard/Dashboard';
import AssessmentList from './pages/AssessmentList/AssessmentList';
import AssessmentView from './pages/AssessmentView/AssessmentView';
import NotFound from './pages/NotFound/NotFound';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard token="your_token_here" />} />
      <Route path="/assessments" element={<AssessmentList token="your_token_here"/>} />
      <Route path="/assessments/:id" element={<AssessmentView token="your_token_here"/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;