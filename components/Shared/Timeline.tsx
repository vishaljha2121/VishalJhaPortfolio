
import styles from './Timeline.module.css'

export interface TimelineItem {
    date: string
    role: string
    company: string
    description: string[]
    techStack?: string[]
}

interface TimelineProps {
    items: TimelineItem[]
}

export default function Timeline({ items }: TimelineProps) {
    return (
        <div className={styles.timeline}>
            {items.map((item, idx) => (
                <div key={idx} className={styles.item}>
                    <div className={styles.marker}></div>
                    <div className={styles.date}>{item.date}</div>
                    <div className={styles.content}>
                        <h3 className={styles.role}>{item.role} @ {item.company}</h3>
                        <ul className={styles.description}>
                            {item.description.map((desc, i) => (
                                <li key={i}>{desc}</li>
                            ))}
                        </ul>
                        {item.techStack && (
                            <div className={styles.techStack}>
                                {item.techStack.join(' • ')}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
