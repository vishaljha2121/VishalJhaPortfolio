
import styles from './Metrics.module.css'

interface Metric {
    number: string
    label: string
}

export default function Metrics({ data }: { data: Metric[] }) {
    return (
        <div className={styles.highlights}>
            <div className={styles.highlightGrid}>
                {data.map((h, i) => (
                    <div key={i} className={styles.highlightItem}>
                        <div className={styles.number}>{h.number}</div>
                        <div className={styles.label}>{h.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
