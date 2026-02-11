
import Head from 'next/head'
import styles from '@/styles/Home.module.css'

export default function Resume() {
    return (
        <>
            <Head>
                <title>Resume | Vishal Jha</title>
            </Head>
            <div className={styles.section} style={{ textAlign: 'center' }}>
                <h1 className={styles.title}>Resume</h1>
                <div style={{ marginBottom: '2rem' }}>
                    <a href="/resume.pdf" download className="button primary">Download PDF</a>
                </div>
                <div style={{ height: '100vh', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    <object data="/resume.pdf" type="application/pdf" width="100%" height="100%">
                        <div style={{ padding: '2rem' }}>
                            <p>Unless you upload a resume.pdf to the public folder, this won't show anything!</p>
                            <p><a href="/resume.pdf">Download PDF</a></p>
                        </div>
                    </object>
                </div>
            </div>
        </>
    )
}
