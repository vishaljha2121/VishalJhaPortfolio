
import Link from 'next/link'
import styles from './TopNav.module.css'
import { useRouter } from 'next/router'

export default function TopNav() {
    const router = useRouter()

    const isActive = (path: string) => {
        if (path === '/') return router.pathname === '/' ? styles.active : ''
        return router.pathname.startsWith(path) ? styles.active : ''
    }

    return (
        <nav className={styles.nav}>
            <div className={styles.container}>
                <Link href="/">
                    <a className={styles.logo}>V.</a>
                </Link>
                <ul className={styles.links}>
                    <li><Link href="/"><a className={isActive('/')}>Home</a></Link></li>
                    <li><Link href="/about"><a className={isActive('/about')}>About</a></Link></li>
                    <li><Link href="/projects"><a className={isActive('/projects')}>Projects</a></Link></li>
                    <li><Link href="/experience"><a className={isActive('/experience')}>Experience</a></Link></li>
                    <li><Link href="/writing"><a className={isActive('/writing')}>Research</a></Link></li>
                    <li><Link href="/resume"><a className={isActive('/resume')}>Resume</a></Link></li>
                    {/* Contact is usually a CTA, but user wants it in nav too? Yes "Contact" in nav */}
                    <li><Link href="/contact"><a className={isActive('/contact')}>Contact</a></Link></li>
                </ul>
            </div>
        </nav>
    )
}
