package com.potentii.xyinc.infra.geometry;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
public class Circle {
	@Getter
	@Setter
	private Point center;
	@Getter
	@Setter
	private int radius;
	@Getter
	private double radiusSqr;


	public Circle(int x, int y, int radius){
		this.center = new Point(x, y);
		this.radius = radius;

		// *Storing the radius squared (radius^2):
		this.radiusSqr = Math.pow(radius, 2);
	}


	public boolean isInArea(int x, int y){
		return isInArea(new Point(x, y));
	}


	public boolean isInArea(Point point){
		var c1 = Math.abs(center.getX() - point.getX());
		var c2 = Math.abs(center.getY() - point.getY());
		return (Math.pow(c1, 2) + Math.pow(c2, 2)) <= radiusSqr;
	}

}
