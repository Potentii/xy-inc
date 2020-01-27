import express          from 'express'
import ResponseEnvelope from '@xy-inc/common/envelope/response-envelope';
import RequestEnvelope  from '@xy-inc/common/envelope/request-envelope';
import POI              from './poi';
import ValidationError  from '../@infra/error/validation-error';
import CodeError        from '../@infra/error/code-error';
import logger           from '../@infra/logger/log';



const router = new express.Router();



router.post(`/`, async (req, res, next) => {
	try{
		// *Receiving the data from the request body:
		const poi_vo = RequestEnvelope.from(req.body).data;

		// *Checking the data:
		if(!poi_vo)
			return res.status(400).json(ResponseEnvelope.fromError(CodeError.FROM_CODE.INVALID_ENVELOPE));

		// *Trying to create the new POI on the database:
		const new_poi_vo = await POI.createFromVO(poi_vo);

		// *Logging the result:
		logger.debug(`Insert POI route: created POI`, { poi: new_poi_vo });

		// *Sending the newly created POI:
		res.status(201).json(ResponseEnvelope.fromData(new_poi_vo));

	} catch(err){
		// *Logging out the error:
		logger.error(`Insert POI route: Error`, { err: err });

		// *Sending an error response:
		if(err instanceof ValidationError)
			res.status(400).json(ResponseEnvelope.fromError(err));
		else
			res.status(500).json(ResponseEnvelope.fromError(CodeError.FROM_CODE.INTERNAL_ERROR));
	}
});



router.get(`/`, async (req, res, next) => {
	// *Getting the filters from the request url:
	const q = req.query;

	try{
		let pois;

		// *Checking if the request is being filtered by query params (?...):
		if(/\?/.test(req.url)){
			// *Checking if all fields are present:
			if(q.x !== null && q.x !== undefined && !Number.isNaN(Number(q.x))
				&& q.y !== null && q.y !== undefined && !Number.isNaN(Number(q.y))
				&& q.radius !== null && q.radius !== undefined && !Number.isNaN(Number(q.radius))){

				// *Getting the POIs by proximity:
				pois = await POI.findByProximity(q.x, q.y, q.radius);

				// *Logging the result:
				logger.debug(`Find POIs route: Finished searching by proximity`, { items: pois.length, q: q });

			} else{
				// *Sending an error response:
				return res.status(400).json(ResponseEnvelope.fromError(CodeError.FROM_CODE.INVALID_QUERY));
			}
		} else{
			// *Getting all the POIs:
			pois = await POI.findAll();

			// *Logging the result:
			logger.debug(`Find POIs route: Finished searching all`, { items: pois.length });
		}

		// *Sending the found POIs:
		res.status(200).json(ResponseEnvelope.fromData(pois));
	} catch(err){
		// *Logging out the error:
		logger.error(`Find POIs route: Error`, { err: err, q: q });

		// *Sending an error response:
		res.status(500).json(ResponseEnvelope.fromError(CodeError.FROM_CODE.INTERNAL_ERROR));
	}
});



export default router;