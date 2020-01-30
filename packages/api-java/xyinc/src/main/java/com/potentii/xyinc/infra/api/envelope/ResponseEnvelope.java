package com.potentii.xyinc.infra.api.envelope;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
public class ResponseEnvelope<T> {

	@Getter
	@Setter
	private T data;

	@Getter
	@Setter
	private Exception error;


	public static <T> ResponseEnvelope<T> data(T data){
		return new ResponseEnvelope<>(data, null);
	}

	public static <T> ResponseEnvelope<T> error(Exception error){
		return new ResponseEnvelope<>(null, error);
	}

}
