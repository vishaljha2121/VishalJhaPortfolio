
import styles from './Footer.module.css'
import { portfolio } from '@/data/portfolio'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.links}>
                    <a href={`mailto:${portfolio.personal.email}`} target="_blank" rel="noopener noreferrer">Email</a>
                    <a href={portfolio.personal.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href={portfolio.personal.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                </div>
                <div className={styles.copyright}>
                    &copy; {currentYear} {portfolio.personal.name}. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
