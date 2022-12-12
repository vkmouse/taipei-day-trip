const validateEmail = (value: string): boolean => {
  const re = /\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/g;
  const match = re.exec(value);
  return match !== null && match[0] === value;
};

const validateName = (value: string): boolean => {
  const re = /.{1,20}/g;
  const match = re.exec(value);
  return match !== null && match[0] === value;
};

const validatePassword = (value: string): boolean => {
  const re = /[.*a-zA-Z\d]{4,100}/g;
  const match = re.exec(value);
  return match !== null && match[0] === value;
};

export { validateEmail, validateName, validatePassword };
