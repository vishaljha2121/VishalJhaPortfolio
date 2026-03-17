import Head from 'next/head'
import Link from 'next/link'
import Script from 'next/script'
import styles from '@/styles/Home.module.css'
import { blogPosts, BlogPost } from '@/data/blogs'

export async function getStaticPaths() {
    const paths = blogPosts.map((post) => ({
        params: { slug: post.slug },
    }))

    return { paths, fallback: false }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
    const post = blogPosts.find((p) => p.slug === params.slug)

    return {
        props: {
            post,
        },
    }
}

export default function BlogPostPage({ post }: { post: BlogPost }) {
    if (!post) return null;

    return (
        <>
            <Head>
                <title>{post.title} | Vishal Jha</title>
                <meta name="description" content={post.description} />
            </Head>

            <Script
                src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"
                strategy="afterInteractive"
                onLoad={() => {
                    // @ts-ignore
                    mermaid.initialize({ startOnLoad: true, theme: 'default' });
                    // @ts-ignore
                    mermaid.contentLoaded();
                }}
            />

            <main className="container">
                <article>
                    <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1.5rem' }}>
                            <Link href="/">
                                <a className="text-secondary" style={{ fontSize: '0.9rem', borderBottom: 'none' }}>&larr; Home</a>
                            </Link>
                            <Link href="/blog">
                                <a className="text-secondary" style={{ fontSize: '0.9rem', borderBottom: 'none' }}>&larr; Writing</a>
                            </Link>
                        </div>
                        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: '1.1' }}>
                            {post.title}
                        </h1>
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--secondary)', fontSize: '0.95rem', fontFamily: 'var(--font-sans)', alignItems: 'center' }}>
                            <time>{post.date}</time>
                            <span>&middot;</span>
                            <span>Vishal Jha</span>
                            {post.githubUrl && (
                                <>
                                    <span>&middot;</span>
                                    <a href={post.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--foreground)' }}>
                                        <svg height="16" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" style={{ fill: 'currentColor' }}>
                                            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                                        </svg>
                                        GitHub Source
                                    </a>
                                </>
                            )}
                        </div>
                    </header>

                    <div className={styles.section} style={{ fontSize: '1.2rem', lineHeight: '1.8' }} dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>
            </main>
        </>
    )
}
