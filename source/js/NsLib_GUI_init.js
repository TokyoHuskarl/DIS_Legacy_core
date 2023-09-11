/*
* @module NsLib_GUI
*/

const DEBUG = 1;
const SINGLEPLAY = true;


// these lines are written in order not to cause error when you test this file on Node.js
var setv = setv || function(){};
var getv = getv || function(){return 0};
var sett = sett || function(){};
var gett = gett || function(){return ""};
var sets = sets || function(){};
var gets = gets || function(){return true};


function deblog(text) {
	if (DEBUG == 1) {
		console.log(text);
		Cmd.game.log_debug(text);
	}
}


// RM var types
const RMvar = 1,
	RMswitch = 2,
	RMstring = 3,
	RMpicture = 4;

function getRM(typ,add) {
	
	if (typ == RMvar) {
		return getv(add)
	} else if (typ == RMswitch) {
		return gets(add)
	} else if (typ = RMstring) {
		return gett(add)
	}

}


// Set RM Var addresses
// DIS project
//

const RM_MousePointer = {
	x: 51, // v[51]
	y: 52, // v[52]
	click: 43, // ?
}

// RM information var addresses - if these elements become directly accessible through RM2k3 Object later, this part will be removed
const adr_RMresolutionX = 1001,
	adr_RMresolutionY = 1002;

// addresses for RM t[]..
const adr_RMstr_UIorder = 731; // -> NsLib_GUI_functions.tpc -> Str_UI_ORDER


// addresses for RM t[]..
const adr_RMbool_RUN_RENDER = 131; // -> NsLib_GUI_functions.tpc -> Str_UI_ORDER


const adr_DISreg1 = 21;

const adr_DISstr1 = 501;


// macros
function parse_DISid(line,myArray) {
	const [key, value] = line.split('=');
	myArray[key] = parseInt(value,10);
};

// ------------------------------------------------
// DIS objects
// ------------------------------------------------
//
// DIS object is basically container for fundamental datas of DIS on quickjs.
// Whenever you want to access DIS game data, the DIS object serves you as a way to get/set the data..
//

var DIS = DIS || {};

const trp = {}; // troop ID table

const tech = {}; // ["techid",[group,flagbit]]

DIS = { // DIS fundamental components
	initID: function(){ // this must be called every after DIS game id is loaded on the game



		// starts from troop ID
		let TroopIDstr = gett(801); // get scripts/const_troops.txt
		let lines = TroopIDstr.trim().split('\n');
		lines.forEach(line => {
			parse_DISid(line,trp);
		});

		// now you can use troopID by writing like this: trp["TRP_sushi_kensei"] 
		
	},

	restore: function(){
		this.initID(); // restore ID 
	},


	// DIS game consts - never touch here blease?
	RTSFPS: 48, // can be changed 
	AgentsLimit: getv(1004), // v[1004]
},

DIS.macro = {
	timeToFrame: (h,m,s) => ((h * 3600 + m * 60 + s) * DIS.RTSFPS), 
};

//
DIS.building = {

};

DIS.log = {
	
	// ??
	Adrt_ShLog: 782, // same as Shell Log address 
	
	
	
	
	
};

DIS.conf = {

	// resolution
	resolution: [getv(adr_RMresolutionX),getv(adr_RMresolutionY)],

};

// DIS functions around string system
DIS.string = {

	// return string
	getQstr: function(id) {
		const Adrt_Qstr_Head = 20000; // QuickString array starts from this number in DIS
		var string = gett(Adrt_Qstr_Head + id);
		return string;
	},

	getMapstr: function(id) { // ?
		const Adrt_mapstr_head = 40000
		var string = gett(Adrt_mapstr_head + id);
		return string;
	},

}

const Adr_ptr_spawnAgent = 201; //v[201]

DIS.agent = {

	
	genPtrPos: 0,



	// Search Empry Space function - this function searches a blank space for an agent in the agent data space.
	// BUT, it has several problems:
	// 1. It must be very slow.
	// 2. How can it sync the result after inserting some Cmd.game.wait(n)?
	// so this will need improvement anyway...

	searchEmptySpace: function(){ // this must be fugging slow. just experimental 

		// if spawn cmd is not called yet in this frame, getptr.
		if(!Cmd.runFlags.SpawnDetect){this.genPtrPos = getv(Adr_ptr_spawnAgent); Cmd.runFlags.SpawnDetect = true;}
		let emptyspaceID = -1; // if the AgentSpace is full, return -1

		for (let i = 0; i < DIS.AgentsLimit; i++){
			let p = 5001
			this.genPtrPos %= DIS.AgentsLimit; // compared to ternary operator, which is faster?
			p += this.genPtrPos * 300
			this.genPtrPos++; // this increment position is correct since if it's empty, the actual slot ID is (genPtrPos + 1)
			if (getv(p) <= 0){
				emptyspaceID = this.genPtrPos;
				break;
			};
		};

		return emptyspaceID;
	},

	setName: function(agentid,name) {
		
	},

}


DIS.player = {
	
}



// ------------------------------------------------
// DIS RTS manager
// ------------------------------------------------

// The goal of DIS RTS manager system on Quickjs is just to make the game system more flexible, but not to control everything of DIS with it.
// Why? Because js is too slow to handle everything in DIS system (and stuff of RM2k3).
// All these system is just a help helper for developers.

// Particularly, the restoration process shouldn't be too big to handle with.
// The game itself must be able to go on even without management system on Quickjs if possible. I guess.. - TokyoHuskarl


//
if (SINGLEPLAY){
	const TEAM_GAIA = -1,
		TEAM_PLAYER = 0,
		TEAM_ENEMY = 1,
		TEAM_NEUTRAL = 2,
		TEAM_ALLY = 3;
};


// DIS system component classes - these class objs usually work as component under RTS objects.


class nonvolatileVar { // nvVar
	constructor(type, address){
		this.type = type;
		this.address = address;
		this.value = getv(address);
	};

	refresh(){this.value = getv(address);};
	get(){return this.value;};
	set(num){this.value = num; setv(this.address,num);};
	refget(){this.refresh();return this.value;};;

};


// RTSmission Object
//
class RTSmission {
	constructor(missionid,mapid){
		if (missionid == ""){missionid = "mapgentest";};
		this.missionid = missionid; // usually string
		this.mapid = mapid; // if 0, open custom map
		this.allocVarAmount = 0;
		this.essential.mapDataDirectory = missionid; // initially set the same as mission
		this.passedFrame = 0; //  if DIS game is reloaded, then reload from RM var. 
	};

	createMissionVar = function(){
		const Adr_MissionVarMemoryHead = 2001; // ACHTUNG
		const VarmemoryLimit = 20; // ?
		let allocated = Adr_MissionVarMemoryHead + this.allocVarAmount;
		if (this.allocVarAmount < VarmemoryLimit){
			this.allocVarAmount += 1;
			return new nonvolatileVar(RMvar,allocated);
		} else {
			Cmd.game.log_error(("Too many mission variables are declared! Current limit is: " + VarmemoryLimit))
			return NULL;
		}
	};

	conf = { // these matter only at the setting up mission part
		isLEGACYmission: false,
		isSightSystemOn: true,
		isMoraleSystemOn: true,
		isLevelSystemOn: false, // not yet
		
	};
	

	essential = { // these elements must be restored when you reload the game via save/load.
		players: [],
		difficulty: 0,
		weatherType: 0,
		mapDataDirectory: this.mapDataDirectory, // set in constructor
	};

	restore = function(){
		
	};

	// mission.run() - this one is called in every frame.
	run = function(){ // called on RM per 1f -> Dracore/module_core_RTS_mission_general.tpc
		this.passedFrame++; // + 1 frame

		// check simple triggers. if any trigger cond is fulfilled, then send signal to execute Commands
		if(this.triggers.runTriggers()){Cmd.run();};

	};

	// mission.startup()... always called when the mission starts.
	startup = () => {/*OVERRIDE ME!*/}; 

	/*
	StartupWrapper = function(){
		this.startup()
	}; //DO NOT OVERRIDE THISONE!
	*/

	triggers = {
		
		runTriggers: function(){ // return if any trigger condition is fulfilled
			// but how?
			let newQue = this.queue;
			let isTriggered = 0b0;

			for (let TRIGGER of this.queue) {
				let result = TRIGGER.run(); // run the trigger!
				if (result & 0b10){ // if end flag is TRUE
					newQue.splice(newQue.indexOf(TRIGGER),1); // remove the called trigger from newQue
				};
				isTriggered |= result;
			};

			if (isTriggered & 1){ // there was at least one trigger that fulfilled condition
				this.queue = newQue; // then renew queue
				return true; // there was at least one trigger effect called
			};

			return false;
		},
		
		queue: [],
	
	};

	
	createSimpleTrigger_Loop = function(frame) { // make a looping trigger executed by every {frame} 
		let Trig = new RTStrigger();
		Trig.isLoop = true;
		Trig.condition = function(){
			this.timer++;
			if (this.timer >= frame){this.timer = 0; return true;}else{return false;};
		};
		return Trig; // return RTStrigger
	}

	createSimpleTrigger_Timer = function(h,m,s) { // if the set time passed, then call effect()
		let Trig = new RTStrigger();
		let goalFrame = DIS.macro.timeToFrame(h,m,s)
		Trig.condition = function(){
			return (RTS.mission.passedFrame >= goalFrame);
		};
		return Trig;
	}

	createSimpleTrigger_FrameTimer = function(f) { // if the set frame has passed since the trigger set, then call effect()
		let Trig = new RTStrigger();
		Trig.condition = function(){
			this.timer++;
			return (this.timer >= f);
		};
		return Trig;
	}


	setMapData = function(mapdir){ // {string}
		this.essential.mapDataDirectory = mapdir;
	};

	setTrigger = function(trig){ // {RTStrigger}
		this.triggers.queue.push(trig);
	};

	setPlayer = function(id,faction){ // set player in mission.
		this.essential.players[id] = new RTSplayer(id,faction); // push to players array
		if (id == 0 && SINGLEPLAY) { // DIS LEGACY - single player only.
			this.essential.players[id].isHuman = true; // then player0 is always considered human.
		};
	};


	// save and load will destroy this function's objective.
	// so you should use this rather for adjusting agent parameter or whatever
	setTimeout = function(func,delayframe){
		// make an instant trigger whose effect is arg function
		let Trig = new RTStrigger();
		Trig.isLoop = false;
		Trig.condition = function(){
			this.timer++;
			if (this.timer >= delayframe){this.timer = 0; return true;}else{return false;};
		};
		Trig.effect = func;
		this.setTrigger(Trig)
	};

};


// RTS map class
const MAPGEN_nomapgen = 0,
	MAPGEN_loadPictureData = 2,
	MAPGEN_script = 3;



// height gen 
const HGEN_NOTHING = 0,
	HGEN_PRESET = 1,
	HGEN_GENERATE = 2;

class RTSmap {
	constructor(mapdeffile){
		mapdeffile = mapdeffile || "editmode";
		this.source = mapdeffile;
		this.size = [50,50]; // temp
		this.isGenerated = false;
		this.heightgenType = HGEN_NOTHING; // 
		this.tileset = 1; // RM tile set - if it's not defined, at least try to load 1.
		this.terrainSource = "mapdata.png"; // png?
	}
	
	
	build(){ // this function called through mission init process, after RTS.openMissionMapDataloading() done after mapdef.js.txt is read.
		const Adr_TileID = 2060;
		const Adr_HeightGenType = 2056;

		setv(Adr_TileID,this.tileset);
		this.generate();
		setv(Adr_HeightGenType,this.heightgenType)
	};
	
	
	init(){return NULL;}; // override me. can be written in mapdef.js.txt.

	
	generate(){ // if you don't override this function, this object tries to load this.terrainSource unless the map is LEGACYmission - I mean using RMmap.
	
		if (!RTS.mission.conf.isLEGACYmission){
			const Adr_mapTerrainSourceType = 2055;
			setv(Adr_mapTerrainSourceType,2)
			let filename = this.terrainSource.split(".")[0]; // ignore extention
			sett(adr_DISstr1,filename) // return to t[501]
		}
	
	};

	gensync(){
	
	};
};
	


// 
class RTSplayer {
	constructor(id,factionid){
		this.id = id;
		this.faction = factionid;
		this.isHuman = false;
	};

};


// RTStrigger - old simple trigger.
// maybe you need to build up restoring processes for mission and triggers.
// both creation and deletion of the simple triggers must be memorized in RMvar (or str) just for restoring save data. After all.
class RTStrigger {
	constructor(){ // if you give any condition that returns bool as a arg0, it becomes condition of the new trigger.
		
	};

	run = function(){ // if this function returns true, then erase from triggers.
		let result =0b00; // bit1 - triggered flag, bit2 - kill this trigger flag
		if (result |= this.condition()){ // check the condition - if it's true 0b01
			this.effect();
			return result | (!(this.isLoop) << 1); // if this trigger set to keep looping, then return 0b11. 
		};
		
		return result;

	};

	condition = function(){return true;}; // return bool. override me.
	effect = ()=>{ /* override me later in missiondef file! */ }; 
	timer = 0; // ++ in mission trigger run function.
	isLoop = false; // whether this trigger will be called even after fulfilling condition once.

};


class DIS_dialog {
	constructor(string,time){
		this.string = string;
		this.showframe = time;
		this.opensound = ["",0,100,50] // file vol tempo vol
		this.icon = ["",1]; // filename, sprite_number
		this.fontdata = ["",0]; // filename, fontsize
		this.stopworld = false;
		this.size = [114,514];
	};
	effect(){/* override me*/}; // called after this ends

};




//


// ------------------------------------------------
// DIS RTS module
// ------------------------------------------------

let RTS = {
	isRTSmode: false,
	mission: new RTSmission(),
	map: new RTSmap(),
	Mtrig: {}, // mission triggers
	Mvar: {}, // mission vars
	Mbool: {}, // mission switch
	Mstr: {}, // mission strings

	clearMission: function(){
		this.mission = new RTSmission();
		this.map = new RTSmap();
		this.isRTSmode = false;
		this.Mtrig = {}; // mission triggers
		this.Mvar = {}; // mission vars
		this.Mbool = {}; // mission switch
		this.Mstr = {}; // mission strings


	},

	openMission: function(missionid,mapid){ // "openmap" command in the old DISshell.
		this.mission = new RTSmission(missionid,mapid);
		this.isRTSmode = true;
		
	},

	setupMission: function(missionid,mapid){ //
		if (!this.isRTSmode){ // if the isRTSmode flag is not yet set (legacy maps) reopen DISmission
			this.mission = new RTSmission(missionid,mapid);
			this.isRTSmode = true;
		}

		if (this.mission.mapid == 0 || this.mission.mapid == 60 || this.mission.mapid == 61) { // NOT RPG maker legacy map
			// then we're gonna open custom map.
		} else { // RPG maker legacy map. 
			// so be it.
			this.mission.conf.isLEGACYmission = true;
		}
	},

	setupMapLoading: function(mapdir){ // will be called after this.setupMission().
		// sightsystem setting
		const Is_SightSystem_On = 300; // <- header_common.tpc
		sets(Is_SightSystem_On,this.mission.conf.isSightSystemOn);
		
		// set map name into RMstr
		const Adr_mapdirectory = 755;
		sett(Adr_mapdirectory,mapdir);
		deblog(`${mapdir} will be loaded. (t[${Adr_mapdirectory}])`)
		
	},

	openMissionMapData: function(){ // you can call this only after successfully load missiondef.js.txt..
		this.map = new RTSmap(this.mission.essential.mapDataDirectory)
		
	},

	

	restore: function(){ // call this function whenever player loads RMsavedata. reload all datas from RM memories.
		
		// restore mission 

		// restore map
	},




};




// ------------------------------------------------
// DIS Command Object
// ------------------------------------------------

// DIS Command types -> module_Game_scripts_functions.tpc
const CTYP_MAP = 1,
	CTYP_SND = 2,
	CTYP_MISSION = 3,
	CTYP_GAME = 4,
	CTYP_AGENT = 5,
	CTYP_PLAYER = 6,
	CTYP_GROUP = 7,
	CTYP_UI = 8,
	CTYP_END = 999;


// DIS Command string container <- module_Game_scripts_functions.tpc
const LINKSTR_map = 771,
	LINKSTR_snd = 772,
	LINKSTR_mission = 773,
	LINKSTR_game = 774,
	LINKSTR_agent = 775,
	LINKSTR_player = 776,
	LINKSTR_group = 777,
	LINKSTR_END = 778; // footer


// -> module_Game_scripts_general.tpc
const adr_RMbool_RUN_CMD = 132,
	adr_RMStr_CmdOrder = 795;


// DIS Command Object
// (Almost) all command functions in objects in the Cmd module will be executed on RM interpreter, not on js process.
var Cmd = {
	// DIS command
	CmdQueue: "",
	restore: function(){ // call this function when the game loads savedata
		this.runFlags.initAll();
	},

	CmCon: {}, // command name associative array


	Qset: function(typ,name,ord){ // quick queue set
		let cmdid = Cmd.CmCon[name];
		Cmd.CmdQueue += (typ + "," + cmdid + "," + ord + ";");
	},
	
	runFlags: {
		initAll: function() {
			SpawnDetect = false;
			RMwaitDetect = false;
			this.group.cgrp = [];
		},

		SpawnDetect: false, // init this flag
		RMwaitDetect: false, //
	},

	// Cmd.init()
	// make up associative array for commands
	init: function() {
		// start from LINKSTR_map 

		for (let i = LINKSTR_map;i < LINKSTR_END;i++){
			let container = gett(i); // get scripts/const_troops.txt
			container = container.replace(/<.*?>/g, "");
			let lines = container.trim().split(";");
			lines.forEach(line => {
					parse_DISid(line,this.CmCon);
			});
		}

	},

	// Cmd.run()
	// give signal to run DIS commands 
	run: function() {
		// give raw cmd as string to RPGMaker
		sett(adr_RMStr_CmdOrder,this.CmdQueue);
		// turn on RM switch to run interpreter as cev
		sets(adr_RMbool_RUN_CMD,1);
		
		Cmd.CmdQueue = ""; // initialize Command Order
		this.runFlags.initAll();
	},
	

	// actual command objects start 
	//Cmd.game
	game: {
		CmdType: CTYP_GAME,

		exec: function(jsfile) { // execute js file
			Cmd.Qset(this.CmdType,"exec",`${jsfile}`);
		},

		wait: function(RMwaittime) { // RMwaittime: 10 = 1sec, 0 = 1f, -n = {n}f. 
			Cmd.Qset(this.CmdType,"wait",`${RMwaittime}`);
			Cmd.runFlags.RMwaitDetect = true;
		},

		eval: function(jsSentence) { // eval(jsSentence) on the DISCmd interpreter. might be dangerous 
			Cmd.Qset(this.CmdType,"eval",`${jsSentence}`);
		},

		gotoRMmap: function(RMmapid,tilepos) { //
			tilepos = tilepos || [0,0]
			Cmd.Qset(this.CmdType,"gotoRMmap",`${RMmapid},${tilepos[0]},${tilepos[1]}`);
		},

		// log series
		log: function(txt){
			Cmd.Qset(this.CmdType,"msg",`${txt}`);
		},

		log_error: function(txt){
			Cmd.Qset(this.CmdType,"msg",`\\C[17]ERROR:${txt}`);
		},

		log_debug: function(txt){
			Cmd.Qset(this.CmdType,"msg",`\\C[5]JS DEBUG:${txt}`);
		},	
		
		// turnSon:1,


	},

	//Cmd.map
	map: {
		CmdType: CTYP_MAP,
		
		

		
		/* spawnerInfoUpdate: ()=> {
			if (Cmd.bl_SpawnCmdCalled == false){}
		} need to consider well */ 


		spawnAgent: function(troopid,tilepos,team,cohort,dir,stance,flag){ // {int}, array[x,y]
			cohort = cohort || 0;
			dir = dir || 0;
			stance = stance || 0;
			flag = flag || 0;
			
			Cmd.Qset(this.CmdType,"spnAg",`${troopid},${tilepos[0]},${tilepos[1]},${team},${cohort},${dir},${stance}`);
			return DIS.agent.searchEmptySpace(); // kari
			// return {address: 4545, uniqueID: 114514}; // kari
		},

		spawnAgentgroup: function(troopid,tilepos,team,delta,amount,cohort,dir,stance,flag){
			// temp
			let pos = tilepos
			let agentslist = [];
			for (let i = 0; i < amount; i++){ // this one is too slow 
				agentslist[i] = this.spawnAgent(troopid,pos,team,cohort,dir,stance,flag);				
				for (let p = 0; p < 2; p++){pos[p] += delta[p];}; // add delta
			};
			return agentslist;
		},

		spawnStatic: function(staticID,tilepos,team,cohort){
			cohort = cohort || 0; // ok?
			Cmd.Qset(this.CmdType,"spnSt",`${staticID},${tilepos[0]},${tilepos[1]},${team},${cohort}`);
			return DIS.agent.searchEmptySpace();
			
		},

		spawnPalisade: function(tileposbeg,tileposend,team){
			Cmd.Qset(this.CmdType,"spawnPalisade",`${tileposbeg[0]},${tileposbeg[1]},${tileposend[0]},${tileposend[1]},${team}`);
			return DIS.agent.searchEmptySpace();
		},

		spawnWall: function(tileposbeg,tileposend,team){
			Cmd.Qset(this.CmdType,"spawnWall",`${tileposbeg[0]},${tileposbeg[1]},${tileposend[0]},${tileposend[1]},${team}`);
			return DIS.agent.searchEmptySpace();
		},

		generateHeightmap: function(){ // generate heightmap
			Cmd.Qset(this.CmdType,"genHeightmap",""); // just do it
		},


	},

	//Cmd.snd
	snd: {
		CmdType: CTYP_SND, 
		playGlobalSE: function(file,vol,tempo,ballance) { // "cmd_play_global_sound"
			Cmd.Qset(this.CmdType,"pGSE",`${file},${vol},${tempo},${ballance}`);
		},

		playBGM: function(file,vol,tempo,ballance) { // "cmd_play_global_sound"
			Cmd.Qset(this.CmdType,"pBGM",`${file},${vol},${tempo},${ballance}`);
		},
		
	},

	// -------------
	// Cmd.mission 
	// -------------
	mission: {
		CmdType: CTYP_MISSION,
		
		victory:  function(){
			Cmd.Qset(this.CmdType,"endGame",`2`);
		},
		defeat:  function(){
			Cmd.Qset(this.CmdType,"endGame",`1`);
		},
		endMission: function(consequence) { // 1 = def, 2 = vic
			Cmd.Qset(this.CmdType,"endGame",`${consequence}`);
		},

		allowToQuit: function() {
			Cmd.Qset(this.CmdType,"setQuit","");
		},

	},
	
	// -------------
	// Cmd.agent 
	// -------------
	agent: {
		CmdType: CTYP_AGENT,
		
		setName: function(agentAdr, name) {
			Cmd.Qset(this.CmdType,"setName",`${agentAdr},${name}`);
		},

	
	},

	// -------------
	// Cmd.player 
	// -------------
	
	player: {

		CmdType: CTYP_PLAYER,

		revealMap: function(playerid){ 
			Cmd.Qset(this.CmdType,"rvMap",`${playerid}`);
		},

		moveCamera: function(tilepos){
			Cmd.Qset(this.CmdType,"mvCam",`${tilepos[0]},${tilepos[1]}`);
		},

		togglePause: function(bool){
			let sw = Number(bool)
			Cmd.Qset(this.CmdType,"tgPaus",`${sw}`);
		},

		giveResource: function(playerid,resource,amount){ // not done
			Cmd.Qset(this.CmdType,"giveRs",`${playerid},${resource},${amount}`);
		},

		giveTech: function(playerid,tech){ // not done
			Cmd.Qset(this.CmdType,"giveTech",`${playerid},${tech[0]},${tech[1]}`);
		},

	},


	
	// -------------
	// Cmd.group
	// -------------

	group: { 
		CmdType: CTYP_GROUP,
		cgrp: [],

		setCgrp: function(grp){
			let agentlist = "";
			for (let elm of grp) {
				agentlist += elm + "|";
			};
			Cmd.Qset(this.CmdType,"setCgrp",agentlist);
			this.cgrp = grp;
		},

		checkCurrentGroup: function(grp){
			if(grp != this.cgrp){this.setCgrp(grp);};
		},

		registerCohort: function(grp,player,cohortid) { // jissoumati
			checkCurrentGroup(grp)
			Cmd.Qset(this.CmdType,"registerCohort",`${player},${cohortid}`);
		},

		move: function(grp,path,flag){
			checkCurrentGroup(grp)
			Cmd.Qset(this.CmdType,"move",`${player},${cohortid}`);
		},

		attack: function(grp,targetid){
			checkCurrentGroup(grp)
			Cmd.Qset(this.CmdType,"attack",`${targetid}`);

		},

	},


	// -------------
	// Cmd.ui
	// -------------

	//radio dialog
	//
	ui: { 
		CmdType: CTYP_UI,

		queueDialog: function(diaset){
			
		},
		

	},



};




let mouseState = {
	x: 0,
	y: 0,
	click: 0,
	Ldrag: 0,
	Rdrag: 0,
	Mdrag: 0,
}



// UI SYSTEM


// UI types set
const UIOBJ_undefined = 0,
	UIOBJ_checkbox = 1,
	UIOBJ_simplebutton = 2,
	UIOBJ_simplesprite = 3,
	UIOBJ_strpic = 4,
	UIOBJ_radiobutton = 5;

// UI render order
const PICCMD_Keep = 0,
	PICCMD_Refresh = 1,
	PICCMD_Erase = 2,
	PICCMD_Genstr = 3;


/*
* @class NsGUImgr
*
*
*/
// NsGUImgr is a global object which regulates all GUI system in your game
let NsGUImgr = {

	scene: 0,
	mouseState: mouseState,
	presentations: [],

	resetPresens: function() {
		delete this.presentations;
		this.presentations = [];
	},


	// get mouse status
	controlUpdate: function() { 
		this.mouseState.x = getv(RM_MousePointer.x);
		this.mouseState.y = getv(RM_MousePointer.y);
		this.mouseState.click = getv(RM_MousePointer.click);
		this.mouseState.Ldrag = getv(RM_MousePointer.click) == 1005 ? this.mouseState.Ldrag + 1 : 0; // if == 1, it's clicked.
		
	},


	

	// try
	// this one will be called in RM cev loop per 1f, and give orders to other parallel cev manager, I mean UIrendering and ScaleScript commands. 
	runPresen: function() {

		let UIorderstr = "";

		this.controlUpdate() // get mouse vars
		for (let PRESEN of this.presentations) {
			
			if(PRESEN.is_controllable) { //if the presentation is controllable
				PRESEN.proc() // then run all UI objects in the presentation
				
				// order strings..

				UIorderstr += PRESEN.UI_RenderingOrder2RMcev;
				SSCmdOrderstr += PRESEN.UI_ScaleCmdOrder2RMcev;

			}
			
		}

		// give render order string to RPGMaker to execute cmds
		deblog(UIorderstr);
		sett(adr_RMstr_UIorder,UIorderstr);

		//sets(adr_RMbool_RUN_RENDER,1); // call render manager
	},


}



// Presentation
// this should be let in init process of the game.
class Ns_Presentation {
	
	constructor(pid) {
		this.is_controllable = true; // while this property is true, keep running proc function
		this.picidstart = pid; // {int} starts from this RMpid
		this.alloc_pid = pid; // begins from picidstart
		this.UI_components = []; // blank array where you push components
		this.UI_RenderingOrder2RMcev = "";
		this.UI_ScaleCmdOrder2RMcev = "";

	}

	// run all UI objects
	proc = function() {
		let rendering_order_string = ""; // give this string to RM UI rendering manager cev.
		
		for (let part of this.UI_components) {
				rendering_order_string += part.render() + ";";
				part.UIcheck();
		};

		// store rendering order string
		this.UI_RenderingOrder2RMcev = rendering_order_string;

		
		
	};

	add = function(component) {
		this.UI_components.push(component); // push to components array
		this.alloc_pid += component.set_to_presen(this.alloc_pid); // the presentation allocates pid to the object and its children
	};

}


// Fundamental class for every UI objects.
// An UI object usually has one RMpicture, when the object is pushed to the presentation.components array, its pid is set.
class UI_object {
	// x, y
	constructor(x,y) {
		this.UI_objtype = UIOBJ_undefined;
		this.pid = 0;
		this.x = x;
		this.y = y;
		this.children = [];
		this.RGBS = [100,100,100,100]; // array
		this.transparency = 0; // 0 to 100
	}


	setpic = function(picture_file) {
		this.picture = picture_file;
		this.UI_objtype = UIOBJ_simplesprite;
	}

	settxt = function(string) {
		this.text = string;
		this.UI_objtype = UIOBJ_strpic;
	}


	render = function() {
		// override me if you want.
		// initial UIobj render method is quite simple.

		let ORDER = ""; // init

		if (this.picCmd == PICCMD_Refresh) { // renew picture 
			if (this.picture != NULL) { // call show picture cmd
				ORDER = `${this.UI_objtype},${this.pid},${this.picCmd},${this.picture},${this.x},${this.y}`;
				
			} else if (this.text != NULL) { // show string picture cmd
				ORDER = `${this.UI_objtype},${this.pid},${this.picCmd},${this.text},${this.x},${this.y}`;

			}
		}

		this.picCmd == PICCMD_Keep;
		return ORDER;
		
	}

	UIcheck = function() {
		// override me
		
	}

	L_click = function() {
		// override me
			
	}

	R_click = function() {
		// override me
			
	}

	overlap = function() {
		// override me
			
	}

	
	addChild = function(childobj) {
		this.children.push(childobj); // push to components array
	}

	set_to_presen = function(allocpid) {
		// count up how many picutre IDs this UI object needs
		let picture_amount = 1;
		this.pid = allocpid;
		
		for (let child of this.children) {
			if (child instanceof UI_object) { // if this UIobj has child obj, then allocate pic id to the child at the same time 
				picture_amount += child.set_to_presen(allocpid + picture_amount); // ACHTUNG! you should carefully check if this proc is working correctly 
			}
		}
		
		return picture_amount; // pew pew
	}

}

// simple check box that toggles RMswitch or even RMvar.
// (you may think this would do bit flag management, but sadly this code doesn't work for it yet.)
class Simple_Checkbox extends UI_object {
	constructor(x,y,targ_type,targ_address) {
		super(x,y);
		this.UI_objtype = UIOBJ_checkbox;
		this.targTyp = targ_type; // RMvar or RMswitch
		this.targAddr = targ_address; // RM v[n]
		this.flag = Boolean(getRM(targ_type,targ_address));
		this.setCheckMark(this.flag);
		
		this.picCmd = PICCMD_Refresh;
	}

	setCheckMark = function(flag) {
		this.txt = (flag == !flag) ? " x" : " " 
	}

	Lclick = function() {
		// toggle check box flag
		// use RMset
		if (this.targTyp == RMswitch) {
			sets(this.targAddr,this.flag)
		} else if (this.targTyp == RMvar) {
			setv(this.targAddr,this.flag) // is this even needed?
		}

		this.setCheckMark(this.flag);

		
		this.picCmd = PICCMD_Genstr;
		
	}

	UIcheck = function() {
		// check hit box
	}

	render = function() {
		// checkbox,pid,picCmd,text
		// // debug
		let ORDER = `${this.UI_objtype},${this.pid},${this.picCmd},${this.txt},${this.x},${this.y}`;
		this.picCmd = PICCMD_Keep; // reset picCmd
		return ORDER;
	}

	
}

class Radiobutton extends UI_object {
	constructor(x,y,targ_address) {
		super(x,y)
		this.UI_objtype = UIOBJ_radiobutton;
		this.targAddr = targ_address; // RM v[n]
		this.selected = getv(targ_address); // RM v[n]
		this.picCmd = PICCMD_Refresh;
	}

	
	addStrpic = function(relX,relY,text) { // set relative position to Parent Radiobutton object
		// make a quite simple string picture and add it as a child
		let childstr = new UI_object(relX + this.x,relY + this.y); 
		childstr.settxt(text);
		this.addChild(childstr);
	}
	
	addButton =  function(relX,relY,setnum) {
		// make a simple button that turns on  and add it as a child
		let childbut = new UI_object(relX + this.x,relY + this.y); 
		this.addChild(childbut);
	}

	Lclick = function() {

	}

	UIcheck = function() {
		// check hit box
	}

	render = function() {
		// checkbox,pid,picCmd,text
		// // debug
		let ORDER = "";
		for (let child of this.children) {
			child.picCmd = this.picCmd;
			ORDER += child.picCmd.render();
		};

		this.picCmd = PICCMD_Keep; // reset picCmd
		return ORDER;
	}

	
}


// init load
{
	DIS.initID();
	Cmd.init();
}


// init 2
//

