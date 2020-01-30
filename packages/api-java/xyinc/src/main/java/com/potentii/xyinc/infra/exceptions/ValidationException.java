package com.potentii.xyinc.infra.exceptions;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class ValidationException extends CodedException {

	@Getter
	@Setter
	private List<ValidationExceptionPath> paths;

	public ValidationException(String code, String message, List<ValidationExceptionPath> paths) {
		super(code, message);
		this.paths = paths;
	}


	public static ValidationExceptionPathsBuilder pathsBuilder(){
		return new ValidationExceptionPathsBuilder();
	}

}
