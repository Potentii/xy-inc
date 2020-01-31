package com.potentii.xyinc.poi;

import com.potentii.xyinc.infra.exceptions.ValidationException;
import com.potentii.xyinc.poi.repository.PoiRepositoryImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class PoiTests{

	@Autowired
	PoiRepositoryImpl poiRepository;



	@Test
	void canInsertValidPoi(){
		try {
			var poi = new Poi("new poi", 10, 4);
			var createdPoi = poiRepository.insert(poi);

			assertNotNull(createdPoi);
			assertNotNull(createdPoi.get_id());
			assertEquals(createdPoi.getName(), poi.getName());
			assertEquals(createdPoi.getX(), poi.getX());
			assertEquals(createdPoi.getY(), poi.getY());

			var foundPoi = poiRepository.getById(createdPoi.get_id());

			assertNotNull(foundPoi);
			assertEquals(createdPoi, foundPoi);
		} catch (ValidationException e) {
			fail(e);
		}
	}



	@Test
	void cannotInsertWithInvalidPosition(){
		var poi = new Poi("new poi", -10, -4);
		try {
			poiRepository.insert(poi);
			fail("Added POI with invalid position");
		} catch (ValidationException e) {
			assertTrue(e.getPaths().stream().anyMatch(p -> "x".equals(p.getPath()) && p.getValue().equals(poi.getX())));
			assertTrue(e.getPaths().stream().anyMatch(p -> "y".equals(p.getPath()) && p.getValue().equals(poi.getY())));
		} catch (Exception e) {
			fail(e);
		}
	}



	@Test
	void cannotInsertWithInvalidName(){
		var poi1 = new Poi(null, 14, 5);
		try {
			poiRepository.insert(poi1);
			fail("Added POI with invalid name (null)");
		} catch (ValidationException e) {
			assertTrue(e.getPaths().stream().anyMatch(p -> "name".equals(p.getPath()) && p.getValue() == null));
		} catch (Exception e) {
			fail(e);
		}


		var poi2 = new Poi("   ", 0, 12);
		try {
			poiRepository.insert(poi2);
			fail("Added POI with invalid name (blank)");
		} catch (ValidationException e) {
			assertTrue(e.getPaths().stream().anyMatch(p -> "name".equals(p.getPath()) && p.getValue().equals(poi2.getName())));
		} catch (Exception e) {
			fail(e);
		}
	}



	@Test
	void canSearchForAllPois() throws ValidationException {
		var pois = poiRepository.insertAll(List.of(
			new Poi("new poi", 255, 4),
			new Poi("new poi", 99, 4),
			new Poi("new poi", 0, 0),
			new Poi("new poi", 8, 12),
			new Poi("new poi", 10, 55)
		));

		var poisFound = poiRepository.getAll();

		assertTrue(poisFound.containsAll(pois));
	}



	@Test
	void canSearchOnACircle() throws ValidationException {
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

		var insidePois = poiRepository.insertAll(List.of(
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
		));

		var outsidePois = poiRepository.insertAll(List.of(
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
		));

		// *Searching by proximity:
		var foundInside = poiRepository.getByProximity(50, 50, radius);

		var condition =
			// *Checking that all IN POIs have been found:
			foundInside.containsAll(insidePois)
			// *And that all OUT POIs haven't:
			&& outsidePois.stream().noneMatch(foundInside::contains);

		assertTrue(condition);
	}

}
