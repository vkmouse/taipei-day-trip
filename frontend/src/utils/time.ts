const convertDateToStr = (value: Date) => {
  const dateString = value.toISOString();
  const [date, time] = dateString.split('T');
  const [year, month, day] = date.split('-');
  const [hour, minute, second] = time.split(':');
  return `${year}-${month}-${day} ${hour}:${minute}:${second.split('.')[0]}`;
};

export { convertDateToStr };
