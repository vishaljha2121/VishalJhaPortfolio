
import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { portfolio } from '@/data/portfolio'

export default function Projects() {
    return (
        <>
            <Head>
                <title>Projects | {portfolio.personal.name}</title>
            </Head>
            <main className="container">

                <header className={styles.header}>
                    <div className={styles.info}>
                        <h1>Projects</h1>
                        <Link href="/"> &larr; Back to Home</Link>
                    </div>
                </header>

                <section className={styles.section}>
                    <ul className={styles.list}>
                        {portfolio.projects.map((p, i) => (
                            <li key={i}>
                                <a href={p.link || '#'} target="_blank" rel="noopener noreferrer"><strong>{p.title}</strong></a>
                                <p>{p.description} <span className={styles.subtext}>[{p.tech.join(', ')}]</span></p>
                                {p.github && <p className={styles.subtext}><a href={p.github}>[ Code ]</a></p>}
                            </li>
                        ))}
                    </ul>
                </section>

            </main>
        </>
    )
}
