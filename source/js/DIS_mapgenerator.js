/**
 * DIS map generation module
 * @module DISmapgen
 * requires /scripts/jslib/perlin.js.
 *
 */
const DISmapgen = (function(){
	// error if perlin.js is not loaded
	if(typeof noise != "object"){
		errorlog("DIS_mapgenerator.js - Hey it seems that the system has not imported perlin.js yet.\nMapgen system won't work correctly")
		return null;

	} else { 
		return { // actual object methods starts from here
			/**
			 * generateElevationMap.
			 * written by GPT4 and idk wtf going on kek
			 *
			 * @param {int} width
			 * @param {int} height
			 * @param {number} scale - bigger = smoother
			 * @param {float} bias - what bias?
			 * @param {int} max height
			 * @return {object} - returns simple int array.
			 */
			/**
			 *
			 *@param {int} width
			 *@param {int} height
			 *@param {float} scale
			 *@param {float} bias
			 *@param {int} leastElv
			 *@return {[][]} - You need to use DIS.macro.flattenArray() before handing the elevation map to TPC
			 */
			generateElevationMap: function(width, height, scale, bias = 0.5,leastElv = 3) {
				const map = [];

				for (let y = 0; y < height; y++) {
					const row = [];
					for (let x = 0; x < width; x++) {
						const noiseValue = noise.simplex2(x / scale, y / scale);
						const elvValue = Math.max(this.mapNoiseToElevation(noiseValue, bias) + 1, leastElv);
						row.push(elvValue);
					}
					map.push(row);
				}

				return map;
			},

			mapNoiseToElevation: function(value, bias) {
				const normalized = (value + 1) / 2 * bias;
				return Math.floor(normalized * 9) + 1;
			},
		}


	}
})();
deblog("DISmapgen loaded.");



// experiment on VIRTUAL_ENV
if(VIRTUAL_ENV){
	const elevationMap = DIS.macro.flattenArray(DISmapgen.generateElevationMap(40, 40, 30, 0.5));
	let i = 0
	let shit = [];

	for (let elm of elevationMap){
		i++;
		shit.push(elm);
		if (i % 40 == 0) {
			console.log(shit);
			shit = [];
		}
	}
}


