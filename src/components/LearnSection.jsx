import React from 'react';
import styles from '../App.module.css';

function LearnSection({ benefits, heading }) {
  return (
    <section id="learn" className={`${styles.container} ${styles.learn}`} aria-labelledby="learn-heading">
      <h2 id="learn-heading" className={styles.sectionHeading}>{heading}</h2>
      <ol className={styles.benefitList}>
        {benefits.map((benefit, index) => (
          <li className={styles.benefitCard} key={benefit.id}>
            <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
            <h3 className={styles.cardTitle}>{benefit.title}</h3>
            <p className={styles.cardBody}>{benefit.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default LearnSection;
