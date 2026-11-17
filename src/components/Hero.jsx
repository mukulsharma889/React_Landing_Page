import React from 'react';
import styles from '../App.module.css';

function Hero({ content }) {
  const date = content.date.replace('December', 'Dec').toUpperCase();
  const duration = content.duration.replace('utes', '').toUpperCase();

  return (
    <section id="top" className={`${styles.container} ${styles.hero}`} aria-labelledby="page-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{content.eyebrow}</p>
        <h1 id="page-title" className={styles.heroTitle}>{content.headline}</h1>
        <p className={styles.heroIntro}>{content.intro}</p>
        <p className={styles.meta}>{date} · {content.time} · {duration}</p>
        <a className={styles.button} href="#register">{content.cta}</a>
      </div>
      <img className={styles.heroArt} src="/assets/planning-illustration.svg" width="720" height="560" alt="" />
    </section>
  );
}

export default Hero;
