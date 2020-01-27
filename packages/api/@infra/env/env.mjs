import dotenv from 'dotenv';
import path   from 'path';



export default class Env{

	constructor(){}


	/**
	 * Configs the environment variables to be used by the application, depending on the NODE_ENV
	 * - NOTICE: The .env* files are all optional, but in this case the values must be provided by the environment.
	 */
	static load(){
		switch(process.env.NODE_ENV){
		case 'development':
		case '':
		case undefined:
		case null:
			dotenv.config({ path: path.join(process.cwd(), `./.env.development`) });
			break;

		default:
			// Doing nothing...
		}
	}

}