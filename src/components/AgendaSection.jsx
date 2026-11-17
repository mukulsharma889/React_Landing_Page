import React from 'react';
import styles from '../App.module.css';

function AgendaSection({ agenda, heading }) {
  return (
    <section id="agenda" className={`${styles.container} ${styles.agenda}`} aria-labelledby="agenda-heading">
      <h2 id="agenda-heading" className={styles.agendaHeading}>{heading}</h2>
      <ol className={styles.agendaList}>
        {agenda.map((item) => (
          <li className={styles.agendaItem} key={item.id}>
            <span className={styles.agendaTime}>{item.time}</span>
            <h3 className={styles.agendaTitle}>{item.title}</h3>
            <p className={styles.agendaBody}>{item.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default AgendaSection;
