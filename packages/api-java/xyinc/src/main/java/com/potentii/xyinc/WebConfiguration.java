package com.potentii.xyinc;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;
import java.io.IOException;

@Configuration
@EnableWebMvc
public class WebConfiguration implements WebMvcConfigurer {

	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		// *Serving the home page in the root URL:
		registry
			.addViewController("/")
			.setViewName("forward:/index.html");
	}



	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// *Serving the frontend bundle:
		try {
			var env_path = System.getenv("UI_PATH_CWD");
			if(env_path == null || env_path.isBlank())
				return;
			var path = "file:///" + new File(env_path).getCanonicalPath() + "/";

			registry
				.addResourceHandler("/**")
				.addResourceLocations(path);
		} catch(IOException e) {
			throw new RuntimeException("Error parsing the frontend bundle path", e);
		}
	}

}