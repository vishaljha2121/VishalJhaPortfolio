
import Head from 'next/head'
import { useState } from 'react'
import ProjectCard from '@/components/Shared/ProjectCard'
import styles from '@/styles/Home.module.css'
import { portfolio } from '@/data/portfolio'

export default function Projects() {
    const [filter, setFilter] = useState('All')

    const filters = ['All', 'Systems', 'C++', 'Quant', 'ML', 'Python']

    const filteredProjects = filter === 'All'
        ? portfolio.projects
        : portfolio.projects.filter(p => p.tech.includes(filter) || (filter === 'Quant' && (p.tech.includes('Trading') || p.tech.includes('Finance'))))

    return (
        <>
            <Head>
                <title>Projects | {portfolio.personal.name}</title>
            </Head>
            <div className={styles.section}>
                <h1 className={styles.title}>Projects</h1>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`button ${filter === f ? 'primary' : 'secondary'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className={styles.projectGrid}>
                    {filteredProjects.map((p, i) => (
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
            </div>
        </>
    )
}
