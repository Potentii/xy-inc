package com.potentii.xyinc.infra.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
public class ValidationExceptionPath {

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
