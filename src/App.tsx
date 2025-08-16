import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/auth/AuthContext';
import ConfigProvider from './context/config/ConfigContext';

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <Toaster />
        <RouterProvider router={router} />
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
