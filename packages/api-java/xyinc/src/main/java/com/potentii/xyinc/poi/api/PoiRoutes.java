package com.potentii.xyinc.poi.api;

import com.potentii.xyinc.infra.OptionsCheck;
import com.potentii.xyinc.infra.api.envelope.RequestEnvelope;
import com.potentii.xyinc.infra.api.envelope.ResponseEnvelope;
import com.potentii.xyinc.infra.exceptions.ECodedException;
import com.potentii.xyinc.infra.exceptions.ValidationException;
import com.potentii.xyinc.poi.Poi;
import com.potentii.xyinc.poi.repository.PoiRepositoryImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1")
public class PoiRoutes {

	@Autowired
	PoiRepositoryImpl poiRepositoryImpl;



	@GetMapping("/pois")
	ResponseEntity<ResponseEnvelope<List<Poi>>> get(@RequestParam Optional<Integer> x, @RequestParam Optional<Integer> y, @RequestParam Optional<Integer> radius){
		try {
			List<Poi> pois;

			// *Preparing a checker to validate the query filters:
			var filtersChecker = OptionsCheck.from(x, y, radius);
			// *Checking if the request has SOME filters:
			if(filtersChecker.someArePresent()) {
				// *If it have:
				// *Checking if the request has ALL filters:
				if(filtersChecker.allArePresent()) {
					// *If it have:
					// *Searching by proximity:
					pois = poiRepositoryImpl.getByProximity(x.get(), y.get(), radius.get());
				} else {
					// *If it has some filters missing:
					return ResponseEntity
						.badRequest()
						.body(ResponseEnvelope.error(ECodedException.INVALID_QUERY.getException()));
				}
			} else {
				// *If it hasn't any filters:
				// *Searching for all POIs:
				pois = poiRepositoryImpl.getAll();
			}

			// *Sending the found POIs:
			return ResponseEntity
				.ok(ResponseEnvelope.data(pois));

		} catch(Exception e){
			return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(ResponseEnvelope.error(e));
		}
	}



	@PostMapping("/pois")
	ResponseEntity<ResponseEnvelope<Poi>> insert(@RequestBody RequestEnvelope<Poi> newPoi){
		try {
			// *Inserting the POI:
			var insertedPoi = poiRepositoryImpl.insert(newPoi.getData());

			// *Sending OK with the inserted POI:
			return ResponseEntity
				.status(HttpStatus.CREATED)
				.body(ResponseEnvelope.data(insertedPoi));

		} catch(ValidationException e){
			return ResponseEntity
				.badRequest()
				.body(ResponseEnvelope.error(e));
		} catch(Exception e){
			return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(ResponseEnvelope.error(ECodedException.INTERNAL_ERROR.getException()));
		}
	}

}
