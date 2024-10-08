// pages/_app.js
import { NextUIProvider } from '@nextui-org/react';
import '../styles/globals.css';
import Navbar from '@/components/navbar';

function MyApp({ Component, pageProps }) {

  const showNavbar=Component.hideNavbar!==true;
  return (
    <NextUIProvider>
     {showNavbar && <Navbar />}
      
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
