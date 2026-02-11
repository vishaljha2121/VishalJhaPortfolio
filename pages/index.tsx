
import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { portfolio } from '@/data/portfolio'

export default function Home() {
    // Use first 3 projects
    const featuredProjects = portfolio.projects.slice(0, 3)

    return (
        <>
            <Head>
                <title>{portfolio.personal.name} | {portfolio.personal.role}</title>
                <meta name="description" content={portfolio.personal.bio} />
            </Head>

            <main className="container">

                {/* Header: Photo + Info */}
                <header className={styles.header}>
                    <div className={styles.photo}>
                        {/* Placeholder for user photo - using a generic gray 400x400 box or similar if no image */}
                        <div style={{ width: '200px', height: '200px', background: '#e0e0e0', borderRadius: '4px' }}></div>
                    </div>
                    <div className={styles.info}>
                        <h1>{portfolio.personal.name}</h1>
                        <p style={{ marginBottom: '0.25rem' }}><strong>Email:</strong> {portfolio.personal.email.replace('@', ' (at) ')}</p>
                        <p style={{ marginBottom: '0.25rem' }}><strong>GitHub:</strong> <a href={portfolio.personal.github}>vishaljha2121</a></p>
                        <p style={{ marginBottom: '0.25rem' }}><strong>LinkedIn:</strong> <a href={portfolio.personal.linkedin}>vishal-jha21</a></p>
                        <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>{portfolio.personal.role}</p>
                        <p>{portfolio.personal.location}</p>
                    </div>
                </header>

                <section className={styles.section}>
                    <p className={styles.bio}>
                        {portfolio.personal.bio}
                    </p>
                    <p>
                        Before this, I completed my Bachelors at SRM Institute of Science and Technology.
                    </p>
                </section>

                {/* Education - Simple List */}
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

                {/* Experience - Simple List */}
                <section className={styles.section}>
                    <h2>Experience</h2>
                    <ul className={styles.list}>
                        {portfolio.experience.map((exp, i) => (
                            <li key={i}>
                                <strong>{exp.role}</strong> at <strong>{exp.company}</strong> ({exp.date})<br />
                                <span className={styles.subtext}>{exp.description[0]}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Projects - Simple List */}
                <section className={styles.section}>
                    <h2>Selected Projects</h2>
                    <ul className={styles.list}>
                        {featuredProjects.map((p, i) => (
                            <li key={i}>
                                <a href={p.link || '#'} target="_blank" rel="noopener noreferrer"><strong>{p.title}</strong></a>: {p.description} <span className={styles.subtext}>[{p.tech.join(', ')}]</span>
                                {p.github && <> [ <a href={p.github}>code</a> ]</>}
                            </li>
                        ))}
                    </ul>
                    <div style={{ marginTop: '1rem' }}>
                        <Link href="/projects">View all projects &rarr;</Link>
                    </div>
                </section>

                {/* Publications (Placeholder derived from resume) */}
                <section className={styles.section}>
                    <h2>Publications</h2>
                    <ul className={styles.list}>
                        <li>
                            <strong>Multi-model ensemble and architecture comparison</strong>. IJSR, Jan 2022.<br />
                            <span className={styles.subtext}>Compared CNN, ANN, DNN on multiple datasets for accuracy and generalization with fixed hyperparameters.</span>
                        </li>
                        <li>
                            <strong>Crypto sentiment: Social media impact on coin markets</strong>. IJAR, Jun 2023.<br />
                            <span className={styles.subtext}>Analyzed Twitter sentiment to track crypto trends and LTP patterns for risk-aware portfolio allocation.</span>
                        </li>
                    </ul>
                </section>

                {/* Teaching/Other (Placeholder) */}
                <section className={styles.section}>
                    <h2>Teaching</h2>
                    <p><em>(Placeholder for Teaching Assistant roles)</em></p>
                </section>

                <footer className={styles.footer}>
                    <hr />
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </footer>

            </main>
        </>
    )
}
