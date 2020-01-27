import CodeError from './code-error';



export default class ValidationError extends CodeError{
	constructor(paths = [], message){
		super('VALIDATION_ERROR', message);
		this.paths = paths;
	}
}