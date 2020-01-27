export default class POIVO{

	constructor(_id, name, x, y){
		this._id = _id;
		this.name = name;
		this.x = x;
		this.y = y;
	}


	static from(obj){
		return new POIVO(
			obj._id,
			obj.name,
			obj.x,
			obj.y,
		);
	}

}