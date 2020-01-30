package com.potentii.xyinc.poi;

import com.potentii.xyinc.infra.exceptions.ValidationException;
import com.potentii.xyinc.poi.repository.PoiRepositoryImpl;
import com.potentii.xyinc.utils.FunctionWithException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.List;

@SpringBootTest
public class PoiTests{

	@Autowired
	PoiRepositoryImpl poiRepository;

	@Test
	void canInsertValidPoi(){
		try {
			var poi = new Poi("new poi", 10, 4);
			poiRepository.insert(poi);
			// TODO assert poi
		} catch (ValidationException e) {
			// TODO fail test
		}
	}



	@Test
	void cannotInsertWithInvalidPosition(){
		var poi = new Poi("new poi", -10, -4);
		try {
			poiRepository.insert(poi);
			// TODO fail test
		} catch (ValidationException e) {
			// TODO assert exception
		}
	}



	@Test
	void cannotInsertWithInvalidName(){
		var poi1 = new Poi(null, 14, 5);
		try {
			poiRepository.insert(poi1);
			// TODO fail test
		} catch (ValidationException e) {
			// TODO assert exception
		}


		var poi2 = new Poi("   ", 0, 12);
		try {
			poiRepository.insert(poi2);
			// TODO fail test
		} catch (ValidationException e) {
			// TODO assert exception
		}
	}



	@Test
	void canSearchForAllPois(){
		var pois = List.of(
				new Poi("new poi", 10, 4),
				new Poi("new poi", 10, 4),
				new Poi("new poi", 10, 4),
				new Poi("new poi", 10, 4),
				new Poi("new poi", 10, 4)
			)
			.stream()
			.map(FunctionWithException.withDefault(newPoi -> poiRepository.insert(newPoi), null));

		var poisFound = poiRepository.getAll();

		var condition = pois.allMatch(poiCreated -> {
			return poisFound.stream().anyMatch(poiFound -> poiCreated.get_id().equals(poiFound.get_id()));
		});

		// TODO assert condition
	}



	@Test
	void canSearchOnACircle(){
		/*
		 * *Considering a circle on (50,50) with radius of 10:
		 *
		 *     40,60-----------50,60-----------60,60
		 *       |           **  |  **           |
		 *       |      **       |       **      |
		 *   X   |               |        ✓     X|
		 *       |  **           |           **  |
		 *       |               |               |
		 *       |**             |             **|
		 *     40,50✓----------50,50-----------60,50
		 *       |**             |             **|
		 *       |        ✓      |               |
		 *       | **            |            ** |
		 *       |               |               |  X
		 *       |      **       |   ✓   **      |
		 *       |   X       **  |  **           |
		 *     40,40-----------50,40-----------60,40
		 *
		 * Legends:
		 *   | -
		 *     Boundaries of the outer square
		 *   **
		 *     Boundaries of the circle
		 *   ✓
		 *     Points that should be considered IN
		 *   X
		 *     Points that should be considered OUT
		 */

		var radius = 10;
		var radiusSqr = Math.pow(radius, 2);

		var insidePois = List.of(
				new Poi("In", 45, (int) Math.sqrt(Math.pow(45,2)-radiusSqr)),
				new Poi("In", 55, (int) Math.sqrt(Math.pow(55,2)-radiusSqr)),
				new Poi("In", 45, (int) Math.sqrt(Math.pow(45,2)-radiusSqr)),
				new Poi("In", 55, (int) Math.sqrt(Math.pow(55,2)-radiusSqr)),

				new Poi("In", 50, 50),
				new Poi("In", 52, 55),

				new Poi("In", 41, 50),
				new Poi("In", 59, 50),
				new Poi("In", 50, 59),
				new Poi("In", 50, 41),

				new Poi("In", 40, 50),
				new Poi("In", 60, 50),
				new Poi("In", 50, 60),
				new Poi("In", 50, 40)
			)
			.stream()
			.map(FunctionWithException.withDefault(newPoi -> poiRepository.insert(newPoi), null));

		var outsidePois = List.of(
				new Poi("Out", 60, 60),
				new Poi("Out", 60, 40),
				new Poi("Out", 40, 60),
				new Poi("Out", 40, 40),

				new Poi("Out", 59, 59),
				new Poi("Out", 59, 41),
				new Poi("Out", 41, 59),
				new Poi("Out", 41, 41),

				new Poi("Out", 39, 50),
				new Poi("Out", 61, 50),
				new Poi("Out", 50, 61),
				new Poi("Out", 50, 39)
			)
			.stream()
			.map(FunctionWithException.withDefault(newPoi -> poiRepository.insert(newPoi), null));

		// *Searching by proximity:
		var foundInside = poiRepository.getByProximity(50, 50, radius);

		var condition =
			// *Checking that all IN POIs have been found:
			insidePois.allMatch(in -> foundInside.stream().anyMatch(found -> found.get_id().equals(in.get_id())))
			// *And that all OUT POIs haven't:
			&& outsidePois.allMatch(out -> foundInside.stream().anyMatch(found -> found.get_id().equals(out.get_id())));

		// TODO assert condition
	}

}
