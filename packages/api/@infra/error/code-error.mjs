import ERROR_CODES from './e-error-codes';



function CodeError(code, message){
   Error.call(this, message);
   this.code = code;
   this.message = message;
   // this.stack = (new Error).stack;
}

CodeError.prototype = Object.create(Error.prototype);

CodeError.CODES = ERROR_CODES;

CodeError.FROM_CODE = Object.values(CodeError.CODES).reduce((obj, code) => {
   obj[code] = new CodeError(code);
   return obj;
}, {});

export default CodeError;
