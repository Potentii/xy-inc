package com.potentii.xyinc.poi.repository;

import com.potentii.xyinc.infra.exceptions.ValidationException;
import com.potentii.xyinc.infra.exceptions.ValidationException.ValidationExceptionPath;
import com.potentii.xyinc.poi.Poi;
import java.util.ArrayList;
import java.util.List;

public class InsertValidator {

	public static void tryValidate(Poi poi) throws ValidationException {
		List<ValidationExceptionPath> paths = new ArrayList<>();

		// *Validating the POI itself:
		if(poi == null)
			throw new ValidationException("VALIDATION_ERROR", "Invalid POI", paths);

		// *Validating the fields:
		if(poi.getX() < 0)
			paths.add(new ValidationExceptionPath("x", poi.getX(), "The position must be a positive integer"));
		if(poi.getY() < 0)
			paths.add(new ValidationExceptionPath("y", poi.getY(), "The position must be a positive integer"));
		if(poi.getName() == null || poi.getName().trim().isEmpty())
			paths.add(new ValidationExceptionPath("name", poi.getName(), "Name cannot be empty"));

		// *Throwing an exception in case some validation error path was detected:
		if(!paths.isEmpty())
			throw new ValidationException("VALIDATION_ERROR", "Invalid POI", paths);

	}

}
