import express from 'express'
import cors    from 'cors'
import DB      from './@infra/db/db'
import Env     from './@infra/env/env';
import logger  from './@infra/log/log';



let connections = [];
let server;



export async function getServerApp(){

	// *Preparing the environment variables:
	Env.load();

	// *Starting the database connection:
	await DB.instance.connect();

	// *Setting up the server:
	const app = express();
	app.use(cors());
	app.use(express.json());


	// *Setting up the api routes:
	app.use(`/api/v1/pois`, (await import('./poi/routes')).default);

	// *Default API 404:
	app.use(`/api/v1/pois`, (req, res, next) => res.status(404).end());

	// *Setting up the web server:
	app.use(`/`, (await import('./web')).default);

	return app;
}


export async function start(){
	// *Setting up server app:
	const app = await getServerApp();

	// *Starting up the server:
	server = await startServer(app, process.env.PORT);

	return server;
}


export async function stop(){
	await Promise.all([
		DB.instance.disconnect(),
		gracefullyStopServer(),
	]);
}



async function startServer(app, port){
	return new Promise((resolve, reject) => {

		// *Starting the server:
		const server = app.listen(port, () => {
			logger.info(`The server is up`, { port: port });
			resolve(server);
		});


		// *Managing connections:
		server.on('connection', conn => {
			connections.push(conn);
			conn.on('close', () => connections = connections.filter(c => c !== conn));
		});
	});

}


async function gracefullyStopServer(){
	return new Promise((resolve, reject) => {
		let resolved = false;

		// *Asking the server to close:
		server.close(() => {
			logger.info(`Server is shutting down`);
			if(!resolved){
				resolved = true;
				resolve();
			}
		});

		// *Ending connections:
		connections.forEach(c => c.end());

		setTimeout(() => {
			// *After a timeout, destroying the connections:
			connections.forEach(c => c.destroy());
			if(!resolved){
				resolved = true;
				resolve();
			}
		}, 4000);
	});
}