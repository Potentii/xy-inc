package com.potentii.xyinc.poi.repository;

import com.potentii.xyinc.infra.exceptions.ValidationException;
import com.potentii.xyinc.infra.geometry.Circle;
import com.potentii.xyinc.poi.Poi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;


@Repository
public class PoiRepositoryImpl{

	@Autowired
	MongoTemplate mongoTemplate;



	/**
	 * Creates a new POI on the database
	 * @param newPoi The POI to be added
	 * @return The POI created, with its ID
	 * @throws ValidationException When a validation step didn't pass
	 */
	public Poi insert(Poi newPoi) throws ValidationException{
		// *Validating the POI:
		InsertValidator.tryValidate(newPoi);

		// *Resetting the ID:
		newPoi.set_id(null);
		// *Trimming the POI name:
		newPoi.setName(newPoi.getName().trim());

		// *Inserting on database:
		return mongoTemplate.insert(newPoi);
	}



	/**
	 * Creates multiple POIs on the database
	 * @param pois The POIs to be added
	 * @return The POIs created, with their ID
	 * @throws ValidationException When a validation step didn't pass
	 */
	public Collection<Poi> insertAll(Collection<Poi> pois) throws ValidationException{
		// *Validating each POI:
		for (var poi : pois)
			InsertValidator.tryValidate(poi);

		for (var poi : pois) {
			// *Resetting the ID:
			poi.set_id(null);
			// *Trimming the POI name:
			poi.setName(poi.getName().trim());
		}

		// *Inserting on database:
		return mongoTemplate.insertAll(pois);
	}



	/**
	 * Retrieves all the POIs on the map
	 * @return All POIs found
	 */
	public List<Poi> getAll(){
		return mongoTemplate.findAll(Poi.class);
	}



	/**
	 * Retrieves the POI using the given ID
	 * @param _id The POI ID
	 * @return The found POI, or null if it couldn't be found
	 */
	public Poi getById(String _id){
		return mongoTemplate.findById(_id, Poi.class);
	}



	/**
	 * Retrieves all POIs within a circle area
	 * @param x The center x coordinate of the circle
	 * @param y The center x coordinate of the circle
	 * @param radius The circle radius
	 * @return All the found POIs inside this circle area
	 */
	public List<Poi> getByProximity(int x, int y, int radius){
		// *Clamping values bellow 0:
		x      = Math.max(x,      0);
		y      = Math.max(y,      0);
		radius = Math.max(radius, 0);

		// *Searching POIs in a squared area first:
		var query = new Query(
			Criteria
				.where("x").gte(x-radius).lte(x+radius)
				.and("y")  .gte(y-radius).lte(y+radius)
		);

		var poisInSquare = mongoTemplate.find(query, Poi.class);

		// *Creating a circle to search the POIs:
		var circle = new Circle(x, y, radius);

		// *Returning the POIs that are inside the circle defined by the radius:
		return poisInSquare
			.stream()
			.filter(poi -> circle.isInArea(poi.getX(), poi.getY()))
			.collect(Collectors.toList());
	}

}
