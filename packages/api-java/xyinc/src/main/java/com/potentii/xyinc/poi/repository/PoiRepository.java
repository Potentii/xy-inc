package com.potentii.xyinc.poi.repository;

import com.potentii.xyinc.poi.Poi;
import org.springframework.data.mongodb.repository.MongoRepository;

interface PoiRepository extends MongoRepository<Poi, Long>{}
