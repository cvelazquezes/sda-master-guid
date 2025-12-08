import { DAY_OF_WEEK } from '../../../../shared/constants';

export function getNextSaturday(): Date {
  const today = new Date();
  const nextSaturday = new Date(today);
  nextSaturday.setDate(
    today.getDate() +
      ((DAY_OF_WEEK.SATURDAY - today.getDay() + DAY_OF_WEEK.DAYS_IN_WEEK) %
        DAY_OF_WEEK.DAYS_IN_WEEK || DAY_OF_WEEK.DAYS_IN_WEEK)
  );
  return nextSaturday;
}

export function getNextSunday(): Date {
  const today = new Date();
  const nextSunday = new Date(today);
  nextSunday.setDate(
    today.getDate() +
      ((DAY_OF_WEEK.DAYS_IN_WEEK - today.getDay()) % DAY_OF_WEEK.DAYS_IN_WEEK ||
        DAY_OF_WEEK.DAYS_IN_WEEK)
  );
  return nextSunday;
}
