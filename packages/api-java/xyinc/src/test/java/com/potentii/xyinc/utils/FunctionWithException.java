package com.potentii.xyinc.utils;

import java.util.function.Function;

@FunctionalInterface
public interface FunctionWithException<T,R>{
	R apply(T t) throws Exception;

	static <T,R> Function<T,R> withDefault(FunctionWithException<T,R> function, R defaultValue){
		return t -> {
			try {
				return function.apply(t);
			} catch(Exception e) {
				return defaultValue;
			}
		};
	}
}
