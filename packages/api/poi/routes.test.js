import * as server from '../server'

const chai = require('chai');
chai.use(require('chai-http'));
chai.use(require('chai-as-promised'));
const expect = chai.expect;



describe('POI routes', function(){
	this.timeout(5000);


	let api;


	// *Before the tests:
	before(async function(){
		api = chai.request(await server.getServerApp()).keepOpen();
	});


	// *After the tests:
	after(function(done){
		api.close(err => done(err));
	});


	describe('Insertion', function(){

		it(`Should insert a POI`, async function(){
			const poi_obj = {
				name: 'New POI',
				x: 34,
				y: 21,
			};

			const res = await api
				.post('/api/v1/pois')
				.type('json')
				.send({ data: poi_obj });

			expect(res).to.have.status(201);
			expect(res).to.be.json;
			expect(res.body).to.not.haveOwnProperty('error');
			expect(res.body).to.haveOwnProperty('data');
			expect(res.body.data).to.be.an('object');
			expect(res.body.data._id).to.be.a('string');
			expect(res.body.data.name).to.equals(poi_obj.name);
			expect(res.body.data.x).to.equals(poi_obj.x);
			expect(res.body.data.y).to.equals(poi_obj.y);
		});


		describe(`Should not insert invalid POIs`, function(){

			it(`Invalid position`, async function(){
				let res;
				let poi_obj;

				poi_obj = {
					name: 'New POI',
					x: -6,
					y: -40,
				};

				res = await api
					.post('/api/v1/pois')
					.type('json')
					.send({ data: poi_obj });

				expect(res).to.have.status(400);
				expect(res).to.be.json;
				expect(res.body).to.not.haveOwnProperty('data');
				expect(res.body).to.haveOwnProperty('error');
				expect(res.body.error).to.be.an('object');
				expect(res.body.error.code).to.equal('VALIDATION_ERROR');
				expect(res.body.error.paths)
					.to.be.an('array')
					.and.satisfy(paths => {
						return paths.some(p => p.path == 'x' && p.value == poi_obj.x)
							&& paths.some(p => p.path == 'y' && p.value == poi_obj.y)
					});


				poi_obj = {
					name: 'New POI',
					x: 84,
					y: 40.2,
				};

				res = await api
					.post('/api/v1/pois')
					.type('json')
					.send({ data: poi_obj });

				expect(res).to.have.status(400);
				expect(res).to.be.json;
				expect(res.body).to.not.haveOwnProperty('data');
				expect(res.body).to.haveOwnProperty('error');
				expect(res.body.error).to.be.an('object');
				expect(res.body.error.code).to.equal('VALIDATION_ERROR');
				expect(res.body.error.paths)
					.to.be.an('array')
					.and.satisfy(paths => {
						return paths.some(p => p.path == 'y' && p.value == poi_obj.y)
					});
			});


			it(`Invalid name`, async function(){
				const poi_obj = {
					name: null,
					x: 11,
					y: 5,
				};

				const res = await api
					.post('/api/v1/pois')
					.type('json')
					.send({ data: poi_obj });

				expect(res).to.have.status(400);
				expect(res).to.be.json;
				expect(res.body).to.not.haveOwnProperty('data');
				expect(res.body).to.haveOwnProperty('error');
				expect(res.body.error).to.be.an('object');
				expect(res.body.error.code).to.equal('VALIDATION_ERROR');
				expect(res.body.error.paths)
					.to.be.an('array')
					.and.satisfy(paths => {
						return paths.some(p => p.path == 'name' && p.value == poi_obj.name)
					});
			});

		});

	});


	describe('Searching', function(){

		it(`Should search all POIs`, async function(){
			const res = await api
				.get('/api/v1/pois');

			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.not.haveOwnProperty('error');
			expect(res.body).to.haveOwnProperty('data');
			expect(res.body.data).to.be.an('array');
		});


		it(`Should search for POIs inside circle area`, async function(){
			const res = await api
				.get('/api/v1/pois')
				.query({ x: 50, y: 50, radius: 10 });

			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.not.haveOwnProperty('error');
			expect(res.body).to.haveOwnProperty('data');
			expect(res.body.data).to.be.an('array');
		});

	});

});
