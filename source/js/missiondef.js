// DIS mission definition file 
// Experimental Example

// Mission setting
RTS.mission.conf.isSightSystemOn = false;
RTS.mission.setPlayer(0,1); // player, imperials
RTS.mission.setPlayer(1,3); // enemy, dragons

// Use petrovka map generation data.
// You can set directory name where mapdef.js file of the terrain that you want to use.
// Otherwise DIS game will try to find the mapdef.js file in same directory as this file exists.
// If your map is using unique RMmap to configure the mission (I mean Legacy missions like Kushira), setMapData() is meaningless.
RTS.mission.setMapData("Legacy_Petrovka");
deblog("Missiondef load")

// Variables that you want them to preserve must be declared in this way.
// You can of course use global scope but to save memory you should put them under RTS.lc 
RTS.lc.Orthunass = RTS.mission.createMissionVar(); // create a variable whose scope is within the mission




RTS.lc.Orthunass.set(114514)
// RTS.mission.startup() is called in the first setup of the DIS game.
RTS.mission.startup = function(){
	// save
	let orthunassid = Cmd.map.spawnAgent(trp["TRP_dra_hero_orthunass_enemy"],[12,32],0,0,0,0)
	RTS.lc.Orthunass.set(orthunassid); // you have to call set/get funcs of the Mission var.
	Cmd.game.log("gutentag.");
	Cmd.game.log(trp["TRP_dra_hero_orthunass_enemy"]);
	Cmd.player.moveCamera([12,32]);
	Cmd.game.log("I hate dragons so much it's unreal");
	Cmd.game.log("I love dragons so much it's unreal");
	Cmd.game.log("I hate dragons so much it's unreal");
	var possia = 0;
	for (let i = 0 ; i > 30; i++) {
		possia = RTS.mission.createMissionVar();
		possia.set(111);
	}
};

// Trigger 1
	RTS.lc.sampletrig = new RTStrigger(true); // class RTStrigger(condtion)
	RTS.lc.sampletrig.isLoop = true; // let this loop
	RTS.lc.sampletrig.effect = function(){ // if condition is fulfilled, execute commands in this block
		Cmd.game.log("I hate dragons so much it's unreal");
		Cmd.game.log("I love dragons so much it's unreal");
		Cmd.game.log("I hate dragons so much it's unreal");
	};
	RTS.mission.setTrigger(RTS.lc.sampletrig) // now this triggers is set to run in the game


