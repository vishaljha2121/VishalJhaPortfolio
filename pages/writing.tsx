
import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'

export default function Writing() {
    return (
        <>
            <Head>
                <title>Research & Writing | Vishal Jha</title>
            </Head>
            <div className={styles.section}>
                <h1 className={styles.title}>Research & Writing</h1>

                <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
                    Exploring ideas in systems, quantitative finance, and machine learning.
                </p>

                <div className={styles.grid}>
                    {/* Post 1 */}
                    <div className={styles.focusCard}>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '0.5rem' }}>Feb 2024</span>
                        <h3 style={{ fontSize: '1.25rem' }}>Understanding Market Microstructure</h3>
                        <p>A deep dive into order books, matching engines, and price formation.</p>
                        <Link href="#"><a style={{ color: 'var(--primary)', marginTop: '1rem', display: 'inline-block' }}>Read More &rarr;</a></Link>
                    </div>

                    {/* Post 2 */}
                    <div className={styles.focusCard}>
                        <span style={{ fontSize: '0.8rem', opacity: 0.6, display: 'block', marginBottom: '0.5rem' }}>Oct 2023</span>
                        <h3 style={{ fontSize: '1.25rem' }}>Designing Lock-Free Queues in C++</h3>
                        <p>Techniques for high-performance concurrent data structures.</p>
                        <Link href="#"><a style={{ color: 'var(--primary)', marginTop: '1rem', display: 'inline-block' }}>Read More &rarr;</a></Link>
                    </div>
                </div>
            </div>
        </>
    )
}
