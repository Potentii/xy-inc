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



	/**
	 * Provides some standard coded exceptions for common use scenarios
	 */
	public enum ECodedException {

		/**
		 * When the error is unknown or should not be exposed to the receiver
		 */
		INTERNAL_ERROR(new CodedException("INTERNAL_ERROR", "Internal error")),

		/**
		 * When some of the query parameters are not valid
		 */
		INVALID_QUERY(new CodedException("INVALID_QUERY", "Invalid query"));


		@Getter
		private CodedException exception;

		ECodedException(CodedException exception) {
			this.exception = exception;
		}
	}

}
