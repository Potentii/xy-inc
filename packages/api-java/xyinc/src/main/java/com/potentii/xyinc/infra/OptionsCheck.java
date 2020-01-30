package com.potentii.xyinc.infra;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Util to check a set of optional objects
 */
public class OptionsCheck {

	private final List<Optional<?>> optionals;

	private OptionsCheck(List<Optional<?>> optionals) {
		this.optionals = optionals;
	}

	public static OptionsCheck from(Optional<?> ...optionals){
		return new OptionsCheck(Arrays.asList(optionals));
	}

	public boolean allArePresent(){
		return optionals.stream().allMatch(Optional::isPresent);
	}

	public boolean someArePresent(){
		return optionals.stream().anyMatch(Optional::isPresent);
	}

	public boolean allAreEmpty(){
		return optionals.stream().allMatch(Optional::isEmpty);
	}

	public boolean someAreEmpty(){
		return optionals.stream().anyMatch(Optional::isEmpty);
	}

}
