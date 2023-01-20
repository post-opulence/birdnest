import '../styles/globals.css'
import '../styles/home.css'
import React from 'react'
import Head from 'next/head'
import Navbar from './Components/Navbar'
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();


function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
    <>
     <Head>
        <title>Monadikuikka Preservation Agency</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </>
    </QueryClientProvider>
  )
}

export default MyApp