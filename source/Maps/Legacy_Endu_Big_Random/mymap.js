{
	RTS.map.generate = function(){
		const Adr_MapWidth = 2061;
		const Adr_MapHeight = 2062;
		const maptiledata = DIS.map.getTileinfo();
		const elvmap = DIS.macro.flattenArray(DISmapgen.generateElevationMap(getv(Adr_MapWidth), getv(Adr_MapHeight), 40, 0.4,2));
		const ELV = 100000000;
		for (let i = 0; i < maptiledata.length; i++) {
			let terrain = maptiledata[i] % 100;
			if (!((terrain === 22)||(terrain === 18))){ // not water tile
				if (terrain == 19) { // shore
					maptiledata[i] = (maptiledata[i] % ELV) + (Math.max((elvmap[i] - 1),2) * ELV); // write new elevation
				} else {
					maptiledata[i] = (maptiledata[i] % ELV) + (elvmap[i] * ELV); // write new elevation
				};
			};
		};
		// deblog(maptiledata);
		RTS.map.setMapTileInfo(maptiledata);
		deblog("map elevation set")
	};
};

