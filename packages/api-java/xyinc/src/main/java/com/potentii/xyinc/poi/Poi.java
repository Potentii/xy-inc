package com.potentii.xyinc.poi;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


/**
 * Represents a POI (Point Of Interest), which is basically a location on a map with x|y coordinates and a name
 */
@Document(collection = "pois")
@NoArgsConstructor
@AllArgsConstructor
public class Poi {

	@Id
	@Getter
	@Setter
	private String _id;

	@Getter
	@Setter
	private String name;

	@Getter
	@Setter
	private int x;

	@Getter
	@Setter
	private int y;


	public Poi(String name, int x, int y) {
		this.name = name;
		this.x = x;
		this.y = y;
	}

	@Override
	public String toString() {
		return "POI (\"" + name + "\" on { " + x + ", " + y + " })";
	}
}
