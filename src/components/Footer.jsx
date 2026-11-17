import React from 'react';
import styles from '../App.module.css';

function Footer({ content }) {
  return (
    <footer className={`${styles.container} ${styles.footer}`}>
      <section id="privacy" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading" className={styles.privacyHeading}>{content.nav.privacy}</h2>
        <p className={styles.privacyText}>{content.privacy}</p>
      </section>
      <p className={styles.copyright}>{content.footer}</p>
    </footer>
  );
}

export default Footer;
