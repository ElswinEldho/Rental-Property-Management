import './globals.css';

export const metadata = {
  title: 'Rental Property Management System',
  description: 'Enterprise Property Management, Utility Metering and Tenant Payment Portal',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

