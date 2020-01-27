import * as server from './server'


server.start();


process.on('beforeExit', async () => {
	await server.stop();
});