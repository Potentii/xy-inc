package com.potentii.xyinc.infra.exceptions;

import lombok.AllArgsConstructor;
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


	@AllArgsConstructor
	public static class ValidationExceptionPath {

		@Getter
		@Setter
		private String path;
		@Getter
		@Setter
		private Object value;
		@Getter
		@Setter
		private String message;

	}

}
