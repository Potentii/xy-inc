package com.potentii.xyinc.infra.exceptions;

import java.util.ArrayList;
import java.util.List;

public class ValidationExceptionPathsBuilder {

	private List<ValidationExceptionPath> paths = new ArrayList<>();

	public ValidationExceptionPathsBuilder add(String path, Object value, String message){
		paths.add(new ValidationExceptionPath(path, value, message));
		return this;
	}

	public List<ValidationExceptionPath> build(){
		return paths;
	}
}
