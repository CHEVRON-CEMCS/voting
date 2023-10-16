// pages/_app.js
import { AuthProvider } from '@/services/AuthContext';
import '@/styles/globals.css';
import { Toaster } from "@/components/ui/toaster";
import { NewAuthProvider } from '@/services/NewAuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <NewAuthProvider>
        <Component {...pageProps} />
        <Toaster />
      </NewAuthProvider>
    </AuthProvider>
  );
}

export default MyApp;
