
import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { portfolio } from '@/data/portfolio'

export default function About() {
    return (
        <>
            <Head>
                <title>About | {portfolio.personal.name}</title>
            </Head>
            <main className="container">

                <header className={styles.header}>
                    <div className={styles.info}>
                        <h1>About</h1>
                        <Link href="/"> &larr; Back to Home</Link>
                    </div>
                </header>

                <section className={styles.section}>
                    <p className={styles.bio}>
                        {portfolio.personal.bio}
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>Technical Skills</h2>
                    <p>{portfolio.personal.skills.join(', ')}</p>
                </section>

                <section className={styles.section}>
                    <h2>Education</h2>
                    <ul className={styles.list}>
                        {portfolio.education.map((edu, i) => (
                            <li key={i}>
                                <strong>{edu.school}</strong>, {edu.location}<br />
                                {edu.degree} ({edu.date})
                            </li>
                        ))}
                    </ul>
                </section>

            </main>
        </>
    )
}
