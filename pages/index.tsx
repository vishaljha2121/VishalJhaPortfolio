
import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { portfolio } from '@/data/portfolio'
import { blogPosts } from '@/data/blogs'

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
                        {portfolio.personal.photo ? (
                            <img src={portfolio.personal.photo} alt={portfolio.personal.name} style={{ width: '200px', height: '200px', borderRadius: '4px', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '200px', height: '200px', background: '#e0e0e0', borderRadius: '4px' }}></div>
                        )}
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
                        Always keen to explore the overlap of quantitative modeling and robust engineering, I aim to contribute to fintech and trading teams solving real-world latency and scale problems.
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

                {/* Blog Highlights */}
                <section className={styles.section}>
                    <h2>Selected Writing</h2>
                    <div className="blog-card-grid">
                        {blogPosts.slice(0, 2).map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post.slug}>
                                <a className="blog-card">
                                    <time className="text-secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{post.date}</time>
                                    <h3>{post.title}</h3>
                                    <p>{post.description}</p>
                                </a>
                            </Link>
                        ))}
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <Link href="/blog">View all writing &rarr;</Link>
                    </div>
                </section>

                {/* Experience - Simple List */}
                <section className={styles.section}>
                    <h2>Experience</h2>
                    <ul className={styles.list}>
                        {portfolio.experience.map((exp, i) => (
                            <li key={i}>
                                <strong>{exp.role}</strong> at <strong>{exp.company}</strong> ({exp.date})
                                <ul style={{ listStyleType: 'disc', paddingLeft: '1.2rem', marginTop: '0.25rem', marginBottom: '0' }}>
                                    {exp.description.map((desc, j) => (
                                        <li key={j} className={styles.subtext} style={{ marginBottom: '0.25rem' }}>{desc}</li>
                                    ))}
                                </ul>
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

                {/* Publications */}
                <section className={styles.section}>
                    <h2>Publications</h2>
                    <ul className={styles.list}>
                        {portfolio.publications.map((pub, i) => (
                            <li key={i}>
                                {pub.link ? (
                                    <a href={pub.link} target="_blank" rel="noopener noreferrer"><strong>{pub.title}</strong></a>
                                ) : (
                                    <strong>{pub.title}</strong>
                                )}. {pub.venue}, {pub.date}.<br />
                                <span className={styles.subtext}>{pub.description}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Teaching/Other (Placeholder)
                <section className={styles.section}>
                    <h2>Teaching</h2>
                    <p><em>(Placeholder for Teaching Assistant roles)</em></p>
                </section>

                <footer className={styles.footer}>
                    <hr />
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </footer> */}

            </main>
        </>
    )
}
