import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/auth/AuthContext';
import ConfigProvider from './context/config/ConfigContext';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
       <ConfigProvider>
      <AuthProvider>
        <Toaster />
        <RouterProvider router={router} />
      </AuthProvider>
    </ConfigProvider>
    </ThemeProvider>
   
  );
}

export default App;
