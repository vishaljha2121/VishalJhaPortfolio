
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import TopNav from '@/components/Global/TopNav'
import Footer from '@/components/Global/Footer'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Portfolio - Vishal Jha</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <TopNav />
            <Component {...pageProps} />
            <Footer />
        </>
    )
}
