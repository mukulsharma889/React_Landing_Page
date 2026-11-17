import React from 'react';
import styles from '../App.module.css';
import RegistrationForm from './RegistrationForm.jsx';

function RegistrationSection({ content }) {
  return (
    <section id="register" className={`${styles.container} ${styles.registerSection}`} aria-labelledby="register-heading">
      <div className={styles.registerPanel}>
        <div className={styles.registerCopy}>
          <h2 id="register-heading" className={styles.registerHeading}>{content.registerHeading}</h2>
          <p className={styles.registerBody}>{content.registerBody}</p>
          <div className={styles.facilitator}>
            <p className={styles.facilitatorName}>{content.facilitator}</p>
            <p className={styles.facilitatorLabel}>{content.facilitatorLabel}</p>
          </div>
        </div>
        <RegistrationForm content={content} />
      </div>
    </section>
  );
}

export default RegistrationSection;
