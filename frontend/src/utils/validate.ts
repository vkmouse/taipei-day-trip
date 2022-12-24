const validateEmail = (value: string): boolean => {
  const re =
    /\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/g;
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

const validatePhone = (value: string): boolean => {
  const re = /^09[0-9]{8}$/g;
  const match = re.exec(value);
  return match !== null && match[0] === value;
};

const validateNumberOnly = (value: string, length: number) => {
  const re = new RegExp(`^\\d{${length}}$`);
  const match = re.exec(value);
  return match !== null && match[0] === value;
};

const validateCardExpiration = (value: string): boolean => {
  const re = /^(0[1-9]|1[0-2])(\d{2})$/g;
  const match = re.exec(value);
  return match !== null && match[0] === value;
};

export {
  validateCardExpiration,
  validateEmail,
  validateName,
  validateNumberOnly,
  validatePassword,
  validatePhone,
};
