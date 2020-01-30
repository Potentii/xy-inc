package com.potentii.xyinc.infra.api.envelope;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
public class RequestEnvelope<T>{

	@Getter
	@Setter
	private T data;

}
