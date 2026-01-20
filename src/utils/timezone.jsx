import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("id");

const WIB_TIMEZONE = "Asia/Jakarta";

/**
 * Format date to WIB timezone
 * @param {string|Date} date - Date to format
 * @param {string} format - Format string (default: "DD MMMM YYYY, HH:mm")
 * @returns {string} Formatted date in WIB (in Indonesian)
 */
export const formatToWIB = (date, format = "DD MMMM YYYY, HH:mm") => {
  if (!date) return null;
  return dayjs.utc(date).tz(WIB_TIMEZONE).locale("id").format(format);
};

/**
 * Check if deadline has passed (in WIB timezone)
 * @param {string|Date} deadline - Deadline date
 * @returns {boolean} True if deadline has passed
 */
export const isDeadlinePassed = (deadline) => {
  if (!deadline) return false;
  const deadlineWIB = dayjs.utc(deadline).tz(WIB_TIMEZONE);
  const nowWIB = dayjs().tz(WIB_TIMEZONE);
  return nowWIB.isAfter(deadlineWIB);
};

/**
 * Parse date to WIB timezone for backend
 * @param {string|Date} date - Date to parse
 * @returns {string} ISO string in UTC
 */
export const parseToUTC = (date) => {
  if (!date) return null;
  return dayjs.tz(date, WIB_TIMEZONE).utc().toISOString();
};

export default {
  formatToWIB,
  isDeadlinePassed,
  parseToUTC,
};
