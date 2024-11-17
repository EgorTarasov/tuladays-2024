export const pluralize = (
  number: number,
  forms: [string, string, string] | [string, string],
): string => {
  const absNumber = Math.abs(number);
  const lastDigit = absNumber % 10;
  const lastTwoDigits = absNumber % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms[2] ?? forms[1];
  }
  if (lastDigit === 1) {
    return forms[0];
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms[1];
  }
  return forms[2] ?? forms[1];
};

export const getTimeString = (days: number): string => {
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) {
    return `${months} ${pluralize(months, ["месяц", "месяца", "месяцев"])}`;
  } else if (weeks > 0) {
    return `${weeks} ${pluralize(weeks, ["неделя", "недели", "недель"])}`;
  } else {
    return `${days} ${pluralize(days, ["день", "дня", "дней"])}`;
  }
};
