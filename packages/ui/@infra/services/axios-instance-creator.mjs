import axios            from 'axios';
import ResponseEnvelope from '@xy-inc/common/envelope/response-envelope';



function getHeaderPlugin(key){

	if(this.hasOwnProperty(key))
		return this[key];

	if(key === null || key === undefined)
		return undefined;

	for(let obj_key in this)
		if(this.hasOwnProperty(obj_key))
			if(obj_key.toLowerCase() === key.toLowerCase())
				return this[obj_key];

	return undefined;
}


function envelop(data){
	if(!data || typeof data != 'object')
		return data;
	const envelope = ResponseEnvelope.from(data);

	if(envelope.error)
		throw envelope.error;

	return envelope;
}


export default class AxiosInstanceCreator{

	constructor(base_url){
		this._base_url = base_url;
		this._resolve_envelop_response = false;
		this._get_header_utility = false;
	}


	/**
	 *
	 * @returns {AxiosInstanceCreator}
	 */
	resolveResponseEnvelop(){
		this._resolve_envelop_response = true;
		return this;
	}


	/**
	 *
	 * @returns {AxiosInstanceCreator}
	 */
	addGetHeaderUtility(){
		this._get_header_utility = true;
		return this;
	}


	/**
	 *
	 * @returns {AxiosInstance}
	 */
	create(){
		const config = {};
		config.baseURL = this._base_url;

		if(this._resolve_envelop_response)
			config.transformResponse = axios.defaults.transformResponse.concat([envelop]);

		const instance = axios.create(config);

		if(this._get_header_utility)
			instance.interceptors.response.use(res => {
				res.headers['get'] = getHeaderPlugin;
				return res;
			});

		return instance;
	}

}