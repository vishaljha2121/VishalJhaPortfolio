import Head from 'next/head'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import { portfolio } from '@/data/portfolio'
import { blogPosts } from '@/data/blogs'

export default function BlogIndex() {
    return (
        <>
            <Head>
                <title>Blog | {portfolio.personal.name}</title>
                <meta name="description" content="Engineering blog by Vishal Jha." />
            </Head>

            <main className="container">
                <header className={styles.header} style={{ display: 'block', marginBottom: '4rem' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <Link href="/">
                            <a className="text-secondary" style={{ fontSize: '0.9rem', borderBottom: 'none' }}>&larr; Back to Home</a>
                        </Link>
                    </div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Writing</h1>
                    <p className="text-secondary" style={{ fontSize: '1.25rem' }}>
                        Thoughts, tutorials, and deep dives on systems engineering, latency, and architecture.
                    </p>
                </header>

                <section className={styles.section}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        {blogPosts.map((post) => (
                            <article key={post.slug} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <time className="text-secondary" style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{post.date}</time>
                                <h2>
                                    <Link href={`/blog/${post.slug}`}>
                                        <a style={{ borderBottom: 'none' }}>{post.title}</a>
                                    </Link>
                                </h2>
                                <p style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>{post.description}</p>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {post.tags.map(tag => (
                                        <span key={tag} style={{
                                            fontSize: '0.8rem',
                                            padding: '0.2rem 0.6rem',
                                            background: 'var(--border)',
                                            borderRadius: '100px',
                                            color: 'var(--foreground)'
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </>
    )
}
