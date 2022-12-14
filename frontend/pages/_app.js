import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";        
import Layout from '../components/Layout'
import '../styles/globals.css'

import { CookiesProvider } from "react-cookie"



function MyApp({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CookiesProvider>
    
  )
}

export default MyApp

