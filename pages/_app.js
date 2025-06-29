import { ThemeProvider } from '@/app/themecontext';
import { UserProvider } from '@/app/usercontext';
import { QuoteProvider } from '@/app/quotecontext';
import '@/app/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <QuoteProvider>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </QuoteProvider>
    </UserProvider>
  );
}

export default MyApp;
