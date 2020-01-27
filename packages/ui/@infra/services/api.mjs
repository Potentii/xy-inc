import AxiosInstanceCreator from './axios-instance-creator';



let instance;



export default class API{

	constructor(){
		this._base_url = `/api/v1`;
	}


	static get instance(){
		if(!instance)
			instance = new API();
		return instance;
	}


	getClient(){
		if(!this._client)
			this._client = new AxiosInstanceCreator(this._base_url)
				.addGetHeaderUtility()
				.resolveResponseEnvelop()
				.create();
		return this._client;
	}

}