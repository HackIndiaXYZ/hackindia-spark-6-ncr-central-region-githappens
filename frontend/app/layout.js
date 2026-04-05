import './globals.css';
import ThemeProvider from '../components/ThemeProvider';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'SupplyAlert Terminal',
  description: 'Next-Gen Supply Chain Resilience Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#090b0d]">
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
