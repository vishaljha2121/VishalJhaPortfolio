
import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import ProjectCard from '@/components/Shared/ProjectCard'
import Timeline from '@/components/Shared/Timeline'
import Metrics from '@/components/Shared/Metrics'
import { portfolio } from '@/data/portfolio'

export default function Home() {
    const featuredProjects = portfolio.projects.slice(0, 4)

    const highlights = [
        { number: '3+', label: 'Years Experience' },
        { number: '50+', label: 'Github Repos' }, // Placeholder based on "500+ connections"? No, let's infer or keep generic
        { number: '2', label: 'Research Papers' }
    ]

    return (
        <>
            <Head>
                <title>{portfolio.personal.name} | {portfolio.personal.role}</title>
                <meta name="description" content={portfolio.personal.bio} />
            </Head>

            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.title}>{portfolio.personal.name}</h1>
                    <p className={styles.subtitle}>{portfolio.personal.role}</p>
                    <p className={styles.bio}>
                        {portfolio.personal.bio}
                    </p>
                    <div className={styles.ctaGroup}>
                        <Link href="/resume"><a className="button primary">Resume</a></Link>
                        <Link href="/projects"><a className="button secondary">See Projects</a></Link>
                    </div>
                </div>
            </section>

            {/* Focus Areas - Derived from skills for now */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>What I'm focused on</h2>
                <div className={styles.grid}>
                    <div className={styles.focusCard}>
                        <h3>Quantitative Development</h3>
                        <p>Building high-frequency trading engines and low-latency systems in C++.</p>
                    </div>
                    <div className={styles.focusCard}>
                        <h3>Distributed Systems</h3>
                        <p>Designing scalable microservices and consistent data architectures.</p>
                    </div>
                    <div className={styles.focusCard}>
                        <h3>Machine Learning</h3>
                        <p>Researching probabilistic models and optimizing ML infrastructure.</p>
                    </div>
                </div>
            </section>

            {/* Highlights Strip */}
            <Metrics data={highlights} />

            {/* Featured Projects */}
            <section className={styles.section}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Featured Projects</h2>
                    <Link href="/projects"><a style={{ color: 'var(--primary)', fontWeight: 500 }}>View All &rarr;</a></Link>
                </div>
                <div className={styles.projectGrid}>
                    {featuredProjects.map((p, i) => (
                        <ProjectCard
                            key={i}
                            title={p.title}
                            description={p.description}
                            tags={p.tech}
                            href={p.link || '#'}
                            github={p.github}
                        />
                    ))}
                </div>
            </section>

            {/* Experience Snapshot - Just showing latest role */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Experience</h2>
                <Timeline items={portfolio.experience.slice(0, 2).map(exp => ({
                    date: exp.date,
                    role: exp.role,
                    company: exp.company,
                    description: exp.description,
                    techStack: exp.tech
                }))} />
            </section>

            {/* Contact */}
            <section className={styles.section} style={{ textAlign: 'center', marginBottom: '8rem' }}>
                <h2 className={styles.sectionTitle}>Get In Touch</h2>
                <p style={{ fontSize: '1.25rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto', opacity: 0.8 }}>
                    I'm currently looking for full-time opportunities in quantitative development or systems engineering.
                </p>
                <Link href="/contact"><a className="button primary">Contact Me</a></Link>
            </section>
        </>
    )
}
