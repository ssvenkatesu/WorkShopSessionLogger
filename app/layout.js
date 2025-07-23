import './globals.css';
import '../styles/admin.css';
import '../styles/facilitator.css';
import '../styles/participant.css';

export const metadata = {
  title: 'Workshop Session Logger',
  description: 'Digital platform for workshop session management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}