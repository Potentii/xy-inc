import DB  from './@infra/db/db';
import Env from './@infra/env/env';



describe('API tests', async function(){

	// *Before the tests:
	before(async function(){
		Env.load();
		await DB.instance.connect();
	});


	// *After all tests:
	after(async function(){
		await DB.instance.disconnect();
	});


	require('./poi/poi.test');
	require('./poi/routes.test');

});
