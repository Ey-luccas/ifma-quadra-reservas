import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import { AppRouter } from './router/Router';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;

