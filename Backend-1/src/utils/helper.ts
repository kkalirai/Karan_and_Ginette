/* eslint-disable prettier/prettier */
export function generateOTP(): string {
  const characters = '0123456789';
  let OTP = '';
  const length = 6;

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * characters.length);
    OTP += characters[index];
  }

  return OTP;
}

export const csvToArray = (str) => {
  return str.split(',').map(
    (value) => value.replace(/^"|"$/g, '').replace(/""/g, '"'), // Remove surrounding quotes and escape double quotes
  );
};

export const arrayToCSV = (data) => {
  if (!data) {
    return '';
  }
  return data.join(',');
};
