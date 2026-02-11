
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { portfolio } from '@/data/portfolio'

export default function Contact() {
    return (
        <>
            <Head>
                <title>Contact | {portfolio.personal.name}</title>
            </Head>
            <div className={styles.section}>
                <h1 className={styles.title} style={{ textAlign: 'center' }}>Contact Me</h1>

                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <p style={{ marginBottom: '3rem', textAlign: 'center', fontSize: '1.2rem', opacity: 0.8 }}>
                        I am currently open to opportunities. Feel free to reach out via email or LinkedIn.
                    </p>

                    <div className={styles.focusCard} style={{ padding: '2rem', textAlign: 'center' }}>
                        <a href={`mailto:${portfolio.personal.email}`} className="button primary" style={{ marginBottom: '1rem', width: '100%' }}>
                            Email: {portfolio.personal.email}
                        </a>
                        <a href={portfolio.personal.linkedin} target="_blank" rel="noopener noreferrer" className="button secondary" style={{ width: '100%' }}>
                            LinkedIn Profile
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
