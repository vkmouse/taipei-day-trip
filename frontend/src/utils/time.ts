const formatDateTime = (value: Date) => {
  const dateString = value.toISOString();
  const [date, time] = dateString.split('T');
  const [year, month, day] = date.split('-');
  const [hour, minute, second] = time.split(':');
  return { year, month, day, hour, minute, second: second.split('.')[0] };
};

const convertTimeToDate = (value: Date) => {
  const { year, month, day } = formatDateTime(value);
  return `${year}-${month}-${day}`;
};

const convertTimeToDateTime = (value: Date) => {
  const { year, month, day, hour, minute, second } = formatDateTime(value);
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const getShortTimeString = (value: Date) => {
  const { hour, minute } = formatDateTime(value);
  return `${hour}:${minute}`;
};

const getNextDate = (days: number) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
};

const parseDateString = (dateString: string) => {
  const dateParts = dateString.split("-");
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[2], 10);
  const date = new Date(year, month - 1, day + 1);
  date.setUTCHours(0, 0, 0);
  return date;
};

const parseDateTimeString = (dateTimeString: string) => {
  const dateParts = dateTimeString.split(' ');
  const dateString = dateParts[0];
  const timeString = dateParts[1];

  const date = parseDateString(dateString);

  const timeParts = timeString.split(':');
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = parseInt(timeParts[2], 10);

  date.setUTCHours(hours, minutes, seconds);

  return date;
};

export { convertTimeToDate, convertTimeToDateTime, formatDateTime, getNextDate, getShortTimeString, parseDateString, parseDateTimeString };
