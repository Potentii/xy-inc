import mongoose from 'mongoose';


let instance = null;

export default class DB{

	constructor(){
		/**
		 * @type {mongoose.Connection}
		 * @private
		 */
		this._conn = null;
	}


	static get instance(){
		if(!instance)
			instance = new DB;
		return instance;
	}


	/**
	 *
	 * @return {mongoose.Connection}
	 */
	get conn(){
		return this._conn;
	}


	/**
	 * Disconnect from the database
	 * @return {Promise<void>}
	 */
	async disconnect(){
		const conn = this.conn;
		this._conn = null;
		if(conn)
			await conn.close();
	}


	/**
	 * Connect to the database using the ENV variables
	 * @return {Promise<mongoose.Connection>}
	 */
	async connect(){
		if(this._conn)
			return this._conn;

		this._conn = await createConnection({
			host: process.env.DATABASE_HOST,
			port: process.env.DATABASE_PORT,
			name: process.env.DATABASE_NAME,
			user: process.env.DATABASE_USER,
			pass: process.env.DATABASE_PASS,
			srv:  process.env.DATABASE_SRV,
		});

		return this._conn;
	}

}


function generateMongoUrl(user, pass, host, port, name, srv, auth_db){
	const is_srv = typeof srv == 'boolean' ? srv : srv == 'true';

	const protocol_part = is_srv
		? `mongodb+srv://`
		: `mongodb://`;

	const auth_part = user
		? `${user}:${pass}@`
		: ``;

	const host_part = is_srv
		? `${host}`
		: `${host}:${port}`;


	return `${protocol_part}${auth_part}${host_part}/${name}?authSource=${auth_db}`;
}


/**
 * Starts the repository service
 * @param  {object} settings              The settings to configure the database connection
 * @param  {string} settings.host         The database hostname
 * @param  {string} settings.name         The schema name to connect to
 * @param  {string|number} settings.port  The database port (The mongodb default is 27017)
 * @param  {string} settings.user         The connection username
 * @param  {string} settings.pass         The connection password
 * @param  {string|boolean} settings.srv  Whether this connection is SRV or not ('true'/'false' or boolean)
 * @param  {string} settings.auth_db      The authentication database name
 * @return {Promise<mongoose.Connection>} It resolves into the mongoose connection, or it rejects if some error happens
 */
async function createConnection({ host = '127.0.0.1', name, port = '27017', user, pass, srv, auth_db = 'admin' }){
	return new Promise((resolve, reject) => {
		try{
			// *Creating a new connection:
			const conn = mongoose.createConnection(generateMongoUrl(user, pass, host, port, name, srv, auth_db), {
				user,
				pass,
				useNewUrlParser: true,
				poolSize: 6,
				dbName: name,
				useCreateIndex: true,
				promiseLibrary: Promise
			});

			// *Resolving into the connection:
			resolve(conn);
		} catch(err){
			reject(err);
		}
	});
}