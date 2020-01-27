export default class RequestEnvelope{

	constructor(){
		this.data = undefined;
	}


	/**
	 *
	 * @param {*|RequestEnvelope} obj
	 * @returns {RequestEnvelope}
	 */
	static from(obj){
		const envelope = new RequestEnvelope();
		envelope.setData(obj.data);
		return envelope;
	}


	static fromData(data){
		return new RequestEnvelope().setData(data);
	}


	setData(data){
		this.data = data;
		return this;
	}

}