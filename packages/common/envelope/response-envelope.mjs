export default class ResponseEnvelope{

	constructor(){
		/**
		 *
		 * @type {Object|Array|undefined}
		 * @private
		 */
		this.data = undefined;
		/**
		 *
		 * @type {Error|undefined}
		 * @private
		 */
		this.error = undefined;
	}


	/**
	 *
	 * @param {Object|ResponseEnvelope} obj
	 * @returns {ResponseEnvelope}
	 */
	static from(obj){
		const envelope = new ResponseEnvelope();
		envelope.setData(obj.data);
		envelope.setError(obj.error);
		return envelope;
	}


	/**
	 *
	 * @param {Object} data
	 * @returns {ResponseEnvelope}
	 */
	static fromData(data){
		return new ResponseEnvelope().setData(data);
	}


	/**
	 *
	 * @param {Error} error
	 * @returns {ResponseEnvelope}
	 */
	static fromError(error){
		return new ResponseEnvelope().setError(error);
	}


	/**
	 *
	 * @param {Object|Array} data
	 * @returns {ResponseEnvelope}
	 */
	setData(data){
		this.data = data;
		return this;
	}


	/**
	 *
	 * @param {Error} error
	 * @returns {ResponseEnvelope}
	 */
	setError(error){
		this.error = error;
		return this;
	}

}