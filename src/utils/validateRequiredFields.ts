import { badRequestError } from '_app/errors';

const camelCaseToWords = (camelCase: string) => {
  return camelCase.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
};

const validateRequiredFields = (data: any, requiredFields: string[]) => {
  for (const field of requiredFields) {
    if (!data[field]) {
      const readableField = camelCaseToWords(field);
      throw badRequestError(`Missing required field: ${readableField}`);
    }
  }
};

export default validateRequiredFields;
