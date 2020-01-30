package com.potentii.xyinc.infra.exceptions;

import lombok.Getter;
import lombok.Setter;


public class CodedException extends Exception {
	@Getter
	@Setter
	private String code;

	public CodedException(String code, String message) {
		super(message);
		this.code = code;
	}
}
