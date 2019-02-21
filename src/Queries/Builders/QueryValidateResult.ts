export interface IInvalidValidationResult {
  isValid: boolean;
  invalidAttributes: any;
}

export interface IValidValidationResult {
  isValid: boolean;
}

export const QueryValidateResult = {
  invalid: (invalidAttributes: any): IInvalidValidationResult => ({ isValid: false, invalidAttributes }),
  valid: (): IValidValidationResult => ({ isValid: true }),
};
