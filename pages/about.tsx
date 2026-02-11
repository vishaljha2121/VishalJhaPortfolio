
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { portfolio } from '@/data/portfolio'

export default function About() {
    return (
        <>
            <Head>
                <title>About | {portfolio.personal.name}</title>
            </Head>
            <div className={styles.section}>
                <h1 className={styles.title}>About Me</h1>

                <div className={styles.bio}>
                    <p>{portfolio.personal.bio}</p>
                </div>

                <h2 className={styles.sectionTitle} style={{ marginTop: '4rem' }}>Technical Skills</h2>
                <div className={styles.focusCard}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {portfolio.personal.skills.map(skill => (
                            <span key={skill} style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                            }}>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <h2 className={styles.sectionTitle} style={{ marginTop: '4rem' }}>Education</h2>
                <div className={styles.grid}>
                    {portfolio.education.map((edu, i) => (
                        <div key={i} className={styles.focusCard}>
                            <h3>{edu.school}</h3>
                            <p><strong>{edu.degree}</strong></p>
                            <p style={{ opacity: 0.7 }}>{edu.date} | {edu.location}</p>
                            {edu.coursework && (
                                <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                                    Relevant Coursework: {edu.coursework.join(', ')}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
