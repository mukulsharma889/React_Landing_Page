export function normalizeName(value) {
  return value.trim().replace(/\s+/gu, ' ');
}

export function validateName(value) {
  const normalized = normalizeName(value);
  const length = Array.from(normalized).length;
  const hasLetter = /\p{L}/u.test(normalized);
  const usesAllowedCharacters = /^[\p{L}\p{M} '\u2019-]+$/u.test(normalized);

  return {
    isValid: length >= 2 && length <= 60 && hasLetter && usesAllowedCharacters,
    normalized,
  };
}

export function validateEmail(value) {
  const normalized = value.trim().toLowerCase();
  const parts = normalized.split('@');

  if (normalized.length < 1 || normalized.length > 254 || parts.length !== 2) {
    return { isValid: false, normalized };
  }

  const [local, domain] = parts;
  const domainLabels = domain.split('.');
  const hasWhitespace = /\s/u.test(normalized);
  const hasConsecutiveDots = normalized.includes('..');
  const hasEdgeDot = local.startsWith('.')
    || local.endsWith('.')
    || domain.startsWith('.')
    || domain.endsWith('.');
  const hasValidDomain = domainLabels.length >= 2
    && domainLabels.every((label) => label.length > 0);

  return {
    isValid: Boolean(local)
      && Boolean(domain)
      && !hasWhitespace
      && !hasConsecutiveDots
      && !hasEdgeDot
      && hasValidDomain,
    normalized,
  };
}
