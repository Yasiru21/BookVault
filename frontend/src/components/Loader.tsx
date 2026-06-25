import styles from './Loader.module.css';

interface LoaderProps {
  message?: string;
  fullPage?: boolean;
}

/**
 * Animated loading spinner with optional full-page overlay mode.
 */
export default function Loader({ message = 'Loading…', fullPage = false }: LoaderProps) {
  return (
    <div className={`${styles.wrapper} ${fullPage ? styles.fullPage : ''}`}>
      <div className={styles.spinner} aria-label="Loading" role="status">
        <div className={styles.ring} />
        <div className={styles.ring} />
        <div className={styles.ring} />
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}

/**
 * Skeleton placeholder for book cards while data is loading.
 */
export function BookCardSkeleton() {
  return (
    <div className={`glass-card ${styles.skeletonCard}`}>
      <div className={`skeleton ${styles.skeletonIcon}`} />
      <div className={styles.skeletonContent}>
        <div className={`skeleton ${styles.skeletonTitle}`} />
        <div className={`skeleton ${styles.skeletonAuthor}`} />
        <div className={`skeleton ${styles.skeletonDesc}`} />
        <div className={`skeleton ${styles.skeletonDesc}`} style={{ width: '70%' }} />
      </div>
    </div>
  );
}
