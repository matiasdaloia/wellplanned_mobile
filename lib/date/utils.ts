export const normalizeLongDay = (day: string) =>
  day
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const LUNCH_RECOMMENDATIONS_START_HOUR = 0;
const LUNCH_RECOMMENDATIONS_END_HOUR = 15;

const DINNER_RECOMMENDATIONS_START_HOUR = LUNCH_RECOMMENDATIONS_END_HOUR;
const DINNER_RECOMMENDATIONS_END_HOUR = 24;

export const isLunchTime = () => {
  const lunchStartTime = new Date();
  lunchStartTime.setHours(LUNCH_RECOMMENDATIONS_START_HOUR, 0, 0, 0);
  const lunchEndTime = new Date();
  lunchEndTime.setHours(LUNCH_RECOMMENDATIONS_END_HOUR, 0, 0, 0);

  const now = new Date();
  return now >= lunchStartTime && now <= lunchEndTime;
};

export const isDinnerTime = () => {
  const dinnerStartTime = new Date();
  dinnerStartTime.setHours(DINNER_RECOMMENDATIONS_START_HOUR, 0, 0, 0);
  const dinnerEndTime = new Date();
  dinnerEndTime.setHours(DINNER_RECOMMENDATIONS_END_HOUR, 0, 0, 0);

  const now = new Date();
  return now >= dinnerStartTime && now <= dinnerEndTime;
};

export const todaySlot = new Date().getDay();
