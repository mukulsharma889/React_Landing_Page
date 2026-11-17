import React from 'react';
import AgendaSection from './components/AgendaSection.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import LearnSection from './components/LearnSection.jsx';
import RegistrationSection from './components/RegistrationSection.jsx';
import content from './content.json';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.page}>
      <Header nav={content.nav} />
      <main>
        <Hero content={content} />
        <LearnSection benefits={content.benefits} heading={content.learnHeading} />
        <AgendaSection agenda={content.agenda} heading={content.agendaHeading} />
        <RegistrationSection content={content} />
      </main>
      <Footer content={content} />
    </div>
  );
}

export default App;
