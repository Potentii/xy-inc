export default class TestError extends Error{
	constructor(message = 'Test manually failed'){
		super(message);
	}
}