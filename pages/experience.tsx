
import Head from 'next/head'
import Timeline from '@/components/Shared/Timeline'
import styles from '@/styles/Home.module.css'
import { portfolio } from '@/data/portfolio'

export default function Experience() {
    return (
        <>
            <Head>
                <title>Experience | {portfolio.personal.name}</title>
            </Head>
            <div className={styles.section}>
                <h1 className={styles.title}>Experience</h1>
                <Timeline items={portfolio.experience.map(exp => ({
                    date: exp.date,
                    role: exp.role,
                    company: exp.company,
                    description: exp.description,
                    techStack: exp.tech
                }))} />
            </div>
        </>
    )
}
