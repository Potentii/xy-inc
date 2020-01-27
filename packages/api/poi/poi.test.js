import mongoose        from 'mongoose';
import POIVO           from '@xy-inc/common/poi-vo';
import ValidationError from '../@infra/error/validation-error';
import TestError       from '../@infra/error/test-error';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;



describe('POI', function(){

	let POI;


	// *Before the tests:
	before(async function(){
		POI = (await import('./poi')).default;
	});


	describe('Insertion', function(){

		it(`Should insert a POI`, async function(){
			const poi = new POIVO(null, 'POI name', 10, 6);
			// *Creating the POI:
			const created = await POI.createFromVO(poi);

			// *Checking if the return is OK:
			expect(created._id).to.be.an.instanceof(mongoose.Types.ObjectId);
			expect(created.name).to.equals(poi.name);
			expect(created.x).to.equals(poi.x);
			expect(created.y).to.equals(poi.y);

			// *Trying to find the POI as a mongo document:
			const found = await POI.findById(created._id);

			expect(found._id).to.be.an.instanceof(mongoose.Types.ObjectId);
			expect(found.name).to.equals(poi.name);
			expect(found.x).to.equals(poi.x);
			expect(found.y).to.equals(poi.y);
		});


		describe(`Should not insert invalid POIs`, function(){

			it(`Invalid position`, async function(){

				// *Trying to create the POI:
				const poi1 = new POIVO(null, 'POI name', -3, -6);
				try{
					await POI.createFromVO(poi1);
					throw new TestError();
				} catch(err){
					expect(err)
						.to.be.an.instanceof(ValidationError)
						.and.satisfy(e => {
							return Array.isArray(e.paths) && e.paths.some(p => p.path == 'x' && p.value == poi1.x)
										&& Array.isArray(e.paths) && e.paths.some(p => p.path == 'y' && p.value == poi1.y)
						});
				}


				// *Trying to create the POI:
				const poi2 = new POIVO(null, 'POI name', 5.11, 2);
				try{
					await POI.createFromVO(poi2);
					throw new TestError();
				} catch(err){
					expect(err)
						.to.be.an.instanceof(ValidationError)
						.and.satisfy(e => {
							return Array.isArray(e.paths) && e.paths.some(p => p.path == 'x' && p.value == poi2.x)
						});
				}

			});


			it(`Invalid name`, async function(){

				// *Trying to create the POI:
				const poi = new POIVO(null, null, 3, 6);
				try{
					await POI.createFromVO(poi);
					throw new TestError();
				} catch(err){
					expect(err)
						.to.be.an.instanceof(ValidationError)
						.and.satisfy(e => {
							return Array.isArray(e.paths) && e.paths.some(p => p.path == 'name' && p.value == poi.name)
						});
				}

			});

		});

	});


	describe('Searching', function(){

		it(`Should search all POIs`, async function(){

			const poi_ids = (await POI.findAll()).map(p => String(p._id));
			const doc_ids = (await POI.find({})).map(p => String(p._id));

			expect(poi_ids).to.be.an('array').and.not.to.be.empty;
			expect(doc_ids).to.be.an('array').and.not.to.be.empty;
			expect(poi_ids).to.have.lengthOf(doc_ids.length);
			expect(doc_ids.every(d_id => poi_ids.includes(d_id))).to.be.true;

		});


		it(`Should search for POIs inside circle area`, async function(){
			const inside_ids = (await Promise.all([
				new POIVO(null, 'In', 45, 58),
				new POIVO(null, 'In', 55, 58),
				new POIVO(null, 'In', 45, 42),
				new POIVO(null, 'In', 55, 42),

				new POIVO(null, 'In', 50, 50),
				new POIVO(null, 'In', 52, 55),

				new POIVO(null, 'In', 41, 50),
				new POIVO(null, 'In', 59, 50),
				new POIVO(null, 'In', 50, 59),
				new POIVO(null, 'In', 50, 41),

				new POIVO(null, 'In', 40, 50),
				new POIVO(null, 'In', 60, 50),
				new POIVO(null, 'In', 50, 60),
				new POIVO(null, 'In', 50, 40),
			].map(p => POI.createFromVO(p)))).map(p => String(p._id));

			const outside_ids = (await Promise.all([
				new POIVO(null, 'Out', 60, 60),
				new POIVO(null, 'Out', 60, 40),
				new POIVO(null, 'Out', 40, 60),
				new POIVO(null, 'Out', 40, 40),

				new POIVO(null, 'Out', 59, 59),
				new POIVO(null, 'Out', 59, 41),
				new POIVO(null, 'Out', 41, 59),
				new POIVO(null, 'Out', 41, 41),

				new POIVO(null, 'Out', 39, 50),
				new POIVO(null, 'Out', 61, 50),
				new POIVO(null, 'Out', 50, 61),
				new POIVO(null, 'Out', 50, 39),
			].map(p => POI.createFromVO(p)))).map(p => String(p._id));

			const found_inside_ids = (await POI.findByProximity(50, 50, 10)).map(p => String(p._id));

			const condition = inside_ids.every(inside_id => found_inside_ids.includes(inside_id))
			                  && outside_ids.every(outside_id => !found_inside_ids.includes(outside_id));

			expect(condition).to.be.true;

		});

	});

});
