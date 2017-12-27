export class ErrorResponse {
  constructor(err){
    if(typeof(err) === 'string'){
      this.error = err;
    } else {
      this.error = err.message;
    }
  }
}
export * from './ErrInvalidId';
export * from './ErrValidation';
