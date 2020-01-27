import API             from '../@infra/services/api';
import POIVO           from '@xy-inc/common/poi-vo';
import RequestEnvelope from '@xy-inc/common/envelope/request-envelope';



export default class POIRoot{

	constructor(){}


	/**
	 *
	 * @param {POIVO|Object} poi_vo
	 * @return {Promise<POIVO|null>}
	 */
	static async insert(poi_vo){
		const res = await API
			.instance
			.getClient()
			.post(`/pois`, RequestEnvelope.fromData(poi_vo));

		if(res?.data?.data)
			return POIVO.from(res.data.data);

		return null;
	}


	/**
	 *
	 * @return {Promise<POIVO[]>}
	 */
	static async getAll(){
		const res = await API
			.instance
			.getClient()
			.get(`/pois`);

		if(Array.isArray(res?.data?.data))
			return res.data.data.map(POIVO.from);

		return [];
	}


	/**
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} radius
	 * @return {Promise<POIVO[]>}
	 */
	static async getByProximity(x, y, radius){
		const res = await API
			.instance
			.getClient()
			.get(`/pois?x=${x}&y=${y}&radius=${radius}`);

		if(Array.isArray(res?.data?.data))
			return res.data.data.map(POIVO.from);

		return [];
	}

}