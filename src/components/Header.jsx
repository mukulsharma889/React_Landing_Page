import React from 'react';
import styles from '../App.module.css';

function Header({ nav }) {
  return (
    <header className={`${styles.container} ${styles.header}`}>
      <a href="#top" aria-label="Meera Verma workshop series home">
        <img className={styles.logo} src="/assets/logo.svg" width="280" height="56" alt="Meera Verma workshop series" />
      </a>
      <nav className={styles.nav} aria-label="Primary navigation">
        <ul className={styles.navList}>
          <li><a className={styles.navLink} href="#learn">{nav.learn}</a></li>
          <li><a className={styles.navLink} href="#agenda">{nav.agenda}</a></li>
          <li><a className={`${styles.navLink} ${styles.navCta}`} href="#register">{nav.register}</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
