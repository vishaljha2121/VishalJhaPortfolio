
import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { portfolio } from '@/data/portfolio'

export default function Experience() {
    return (
        <>
            <Head>
                <title>Experience | {portfolio.personal.name}</title>
            </Head>
            <main className="container">

                <header className={styles.header}>
                    <div className={styles.info}>
                        <h1>Experience</h1>
                        <Link href="/"> &larr; Back to Home</Link>
                    </div>
                </header>

                <section className={styles.section}>
                    <ul className={styles.list}>
                        {portfolio.experience.map((exp, i) => (
                            <li key={i}>
                                <div style={{ marginBottom: '0.25rem' }}>
                                    <strong>{exp.role}</strong>, <strong>{exp.company}</strong> ({exp.date})
                                </div>
                                <ul style={{ listStyleType: 'disc', paddingLeft: '2rem', marginTop: '0.5rem' }}>
                                    {exp.description.map((desc, j) => (
                                        <li key={j} style={{ marginBottom: '0.25rem' }}>{desc}</li>
                                    ))}
                                </ul>
                                <div className={styles.subtext} style={{ paddingLeft: '2rem', marginTop: '0.5rem' }}>
                                    Tech Stack: {exp.tech.join(', ')}
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

            </main>
        </>
    )
}
