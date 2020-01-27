import mongoose             from 'mongoose'
import POIVO                from '@xy-inc/common/poi-vo';
import DB                   from '../@infra/db/db';
import MongooseErrorHandler from '../@infra/db/mongoose-error-handler';



const schema = new mongoose.Schema({

	name: {
		type: String,
		required: true,
	},


	x: {
		type: Number,
		required: [true, 'The point coordinates are required'],
		min: [0, `The position must be positive`],
		validate: {
			validator: v => Math.round(v) === v,
			message: props => `${props.value} is not a valid position`
		},
	},


	y: {
		type: Number,
		required: [true, 'The point coordinates are required'],
		min: [0, `The position must be positive`],
		validate: {
			validator: v => Math.round(v) === v,
			message: props => `${props.value} is not a valid position`
		},
	},

});



/**
 * Creates a new POI on the database
 * @param {POIVO} poi_vo
 * @returns {Promise<POIVO>}
 */
schema.statics.createFromVO = async function(poi_vo){
	try{
		// *Stripping out the ID:
		poi_vo._id = undefined;
		// *Creating the new document:
		const created = await new this(this.VOToDocObj(poi_vo)).save();
		return created.toVO();
	} catch(err){
		MongooseErrorHandler.handle(err);
	}
};



/**
 * Searches for POIs within a circular area
 * @param {Number} searchX The 'X' center position of the circle, negatives will be clamped to '0'
 * @param {Number} searchY The 'Y' center position of the circle, negatives will be clamped to '0'
 * @param {Number} radius The circle radius, if 'radius <= 0' it will search for exact X,Y matches
 * @returns {Promise<POIVO[]>}
 */
schema.statics.findByProximity = async function(searchX, searchY, radius){
	try{
		// *Clamping negatives:
		searchX = (searchX<0) ? 0 : searchX;
		searchY = (searchY<0) ? 0 : searchY;
		radius  = (radius <0) ? 0 : radius;

		if(radius == 0){
			// *Finding exact match:
			return (await this.find({ x: searchX, y: searchY, })
				.exec())
				.map(p => p.toVO());
		}

		// *Retrieves the points inside a square:
		const pois = await this.find({
				x: { $gte: searchX-radius, $lte: searchX+radius },
				y: { $gte: searchY-radius, $lte: searchY+radius },
			})
			.exec();

		// *Storing the radius squared:
		const radius_sqr = Math.pow(radius, 2);

		return pois
			.map(p => p.toVO())
			// *Filtering the points using a circular comparer:
			.filter(poi => {
				const c1 = Math.abs(searchX - poi.x);
				const c2 = Math.abs(searchY - poi.y);
				return (Math.pow(c1, 2) + Math.pow(c2, 2)) <= radius_sqr;
			});
	} catch(err){
		MongooseErrorHandler.handle(err);
	}

};



/**
 * Retrieves all POIs in the map
 * @returns {Promise<POIVO[]>}
 */
schema.statics.findAll = async function(){
	try{
		// *Searching for all:
		const pois = await this.find({}).exec();
		return pois.map(p => p.toVO());
	} catch(err){
		MongooseErrorHandler.handle(err);
	}
};



/**
 * Converts the VO to the POI schema document
 * @returns {Object}
 */
schema.statics.VOToDocObj = function(vo){
	return {
		_id: vo._id || undefined,
		name: vo.name,
		x: vo.x,
		y: vo.y,
	}
};



/**
 * Converts the document to it's VO equivalent
 * @returns {POIVO}
 */
schema.methods.toVO = function(){
	return new POIVO(this._id, this.name, this.x, this.y);
};



/**
 * Exporting the compiled mongoose model for this schema
 */
const POI = DB.instance.conn.model('poi', schema);
export default POI;