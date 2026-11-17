import React, { useRef, useState } from 'react';
import { validateEmail, validateName } from '../validation.js';
import styles from '../App.module.css';

const initialValues = { name: '', email: '' };
const initialErrors = { name: false, email: false };

function RegistrationForm({ content }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [success, setSuccess] = useState('');
  const nameRef = useRef(null);
  const emailRef = useRef(null);

  const validateField = (field, value) => (
    field === 'name' ? validateName(value).isValid : validateEmail(value).isValid
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setSuccess('');

    if (hasSubmitted) {
      setErrors((currentErrors) => ({ ...currentErrors, [name]: !validateField(name, value) }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setHasSubmitted(true);
    const nameResult = validateName(values.name);
    const emailResult = validateEmail(values.email);
    const nextErrors = { name: !nameResult.isValid, email: !emailResult.isValid };
    setErrors(nextErrors);

    if (nextErrors.name || nextErrors.email) {
      setSuccess('');
      requestAnimationFrame(() => {
        if (nextErrors.name) nameRef.current?.focus();
        else emailRef.current?.focus();
      });
      return;
    }

    setValues({ name: nameResult.normalized, email: emailResult.normalized });
    setSuccess(content.success.replace('{name}', nameResult.normalized));
  };

  return (
    <form className={styles.formCard} onSubmit={handleSubmit} noValidate>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="full-name">{content.nameLabel}</label>
        <input ref={nameRef} className={`${styles.input} ${errors.name ? styles.inputError : ''}`} id="full-name" name="name" type="text" autoComplete="name" placeholder={content.namePlaceholder} value={values.name} onChange={handleChange} aria-invalid={errors.name || undefined} aria-describedby={errors.name ? 'name-error' : undefined} />
        {errors.name && <p className={styles.error} id="name-error">Error: {content.nameError}</p>}
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="email">{content.emailLabel}</label>
        <input ref={emailRef} className={`${styles.input} ${errors.email ? styles.inputError : ''}`} id="email" name="email" type="email" autoComplete="email" placeholder={content.emailPlaceholder} value={values.email} onChange={handleChange} aria-invalid={errors.email || undefined} aria-describedby={errors.email ? 'email-error' : undefined} />
        {errors.email && <p className={styles.error} id="email-error">Error: {content.emailError}</p>}
      </div>
      <button className={styles.submitButton} type="submit">{content.submitLabel}</button>
      <p className={styles.formHint}>{content.formHint}</p>
      <p className={styles.success} role="status" aria-live="polite">{success}</p>
    </form>
  );
}

export default RegistrationForm;
