
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'

export default function ProjectDetail() {
    const router = useRouter()
    const { slug } = router.query

    return (
        <>
            <Head>
                <title>{slug} | Project Detail</title>
            </Head>
            <div className={styles.section}>
                <Link href="/projects"><a className="button secondary" style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }}>&larr; Back to all projects</a></Link>
                <h1 className={styles.title} style={{ textTransform: 'capitalize', marginBottom: '0.5rem' }}>{slug?.toString().replace('-', ' ')}</h1>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    <span style={{ padding: '0.2rem 0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', fontSize: '0.9rem' }}>C++</span>
                    <span style={{ padding: '0.2rem 0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', fontSize: '0.9rem' }}>Systems</span>
                </div>

                <div className={styles.grid} style={{ gridTemplateColumns: '1fr', gap: '4rem' }}>

                    <section>
                        <h2 className={styles.sectionTitle}>Overview</h2>
                        <div className={styles.focusCard}>
                            <p style={{ marginBottom: '1rem' }}>
                                <strong>Problem:</strong> Standard matching engines often suffer from microsecond-level jitter under high load.
                            </p>
                            <p>
                                This project implements a deterministic, high-throughput matching engine using lock-free ring buffers and kernel bypass networking
                                to achieve sub-microsecond tick-to-trade latency.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className={styles.sectionTitle}>Architecture</h2>
                        <div className={styles.focusCard} style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                            <p style={{ opacity: 0.5 }}>[Architecture Diagram PlaceHolder]</p>
                        </div>
                    </section>

                    <section>
                        <h2 className={styles.sectionTitle}>Technical Deep Dive</h2>
                        <div className={styles.grid}>
                            <div className={styles.focusCard}>
                                <h3>Core Design Decisions</h3>
                                <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem', lineHeight: '1.6' }}>
                                    <li>Single-threaded execution core to avoid context switches.</li>
                                    <li>Price-Time Priority matching logic.</li>
                                    <li>Lock-free circular buffers for order entry.</li>
                                </ul>
                            </div>
                            <div className={styles.focusCard}>
                                <h3>Performance</h3>
                                <ul style={{ paddingLeft: '1.2rem', marginTop: '1rem', lineHeight: '1.6' }}>
                                    <li>Mean Latency: 800ns</li>
                                    <li>99th Percentile: 1.2us</li>
                                    <li>Throughput: 1.5M msgs/sec</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </>
    )
}
