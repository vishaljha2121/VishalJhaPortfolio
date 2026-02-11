
import Link from 'next/link'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
    title: string
    description: string
    tags: string[]
    href: string
    github?: string
    demo?: string
}

export default function ProjectCard({ title, description, tags, href, github, demo }: ProjectCardProps) {
    return (
        <div className={styles.card}>
            <Link href={href}>
                <a className={styles.linkWrapper}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.description}>{description}</p>
                </a>
            </Link>
            <div className={styles.tags}>
                {tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
            </div>
            <div className={styles.links}>
                {github && <a href={github} target="_blank" rel="noopener noreferrer">GitHub</a>}
                {demo && <a href={demo} target="_blank" rel="noopener noreferrer">Demo</a>}
            </div>
        </div>
    )
}
