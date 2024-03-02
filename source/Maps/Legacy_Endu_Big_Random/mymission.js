{
	RTS.map.generate() = function(){
		const maptiledata = DIS.map.getTileinfo();
		const elvmap = DIS.macro.flattenArray(DISmapgen.generateElevationMap(293, 208, 30, 0.5));
		const ELV = 100000000;
		RTS.map.setMapTileInfo(maptiledata); // write new maptile data
	};

}
