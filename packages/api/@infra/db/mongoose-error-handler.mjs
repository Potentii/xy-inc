import ValidationError from '../error/validation-error';



export default class MongooseErrorHandler{

	constructor(){}


	static handle(err){
		// *Treating validation errors:
		if(err.name == 'ValidationError'){
			const paths = [];

			if(err.errors){
				for(let [path, details] of Object.entries(err.errors)){
					if(paths.some(e => new RegExp(path + '\\.', 'i').test(e.path)))
						continue;

					paths.push({
						path: path,
						value: details.value,
						message: details.message,
					});
				}
			}

			throw new ValidationError(paths, err._message);
		}

		throw err;
	}

}