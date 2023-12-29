/*
* @module DIS_js_main_module
*/

// if setv() is undefined, it's virtual enviroment on node.js, qjs or sth.
let VIRTUAL_ENV = (typeof setv == "undefined") ? true : false;


// these lines are written in order not to cause error when you test this file on Node.js
var setv = setv || function(){};
var getv = getv || function(n){return n};
var sett = sett || function(){};
var gett = gett || function(t){return `string t[${t}]`};
var sets = sets || function(){};
var gets = gets || function(){return true};


//0 = normal mode, 1 = debug mode, 2 = developer mode
const BOOT_MODE_NORMAL = 0,
	BOOT_MODE_DEVELOPER = 1,
	BOOT_MODE_DEBUG = 2;

let DEBUG = VIRTUAL_ENV ? BOOT_MODE_DEBUG : BOOT_MODE_NORMAL;

if (gets(316)) { // s[316] is DEBUG mode flag in DIS. 
	DEBUG = BOOT_MODE_DEBUG;
	// check if the game is running developer mode
}

const SINGLEPLAY = true;



// notification for developer mode.
function devmsg(text) {
	if (VIRTUAL_ENV){console.log(text);};
	Cmd.game.log_dev(text);
};


// debug log function for debug mode 
function deblog(text) {
	console.log(text);
	if (!VIRTUAL_ENV){
		Cmd.game.log_debug(text);
	};
};

function debObj(obj) {
	deblog(JSON.stringify(obj))
};

function errorlog(text) {
	if (DEBUG != BOOT_MODE_DEBUG){let contx = "ERROR:" + text;console.log(contx);} else {deblog(`ERROR: ${text}`)};
	return Cmd.game.log_error(text);
}


const LF = "\n";

// RM var types
const RMvar = 1,
	RMswitch = 2,
	RMstring = 3,
	RMpicture = 4,
	RMarray = 5;

// this is not necessarily. kek
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


// global pointers for important objects
let MISSION; // {RTSmission} current mission - always refers to current RTS.mission
let MAP; // {RTSmap} current map
var scene = scene || {};


// global variables

/**
 * @global {DIS_RTSplayer} ptr to RTS player object
 */
let g_PLAYER;  
let g_ENEMY;  
/**
 * @LOCAL {RTS.mission.local} ptr to RTS mission local properties.
 */
let LOCAL;




// ------------------------------------------------
// DIS Data Objects
// ------------------------------------------------
class DATA_entity {
	constructor(id){this.id=id;};
	i = -1; // set in DATA.{datatype}.register()

	/**
	 * getElmAsString
	 * @param {string} key
	 * @return {string}
	 */
	getElmAsString(key){
		let elm;
		let ary = key.split(":"); // check if element expects array

		const stringify_to_DIScsvParam = (input) => {
			if (typeof input == "object") {
				return make_Array_DIStable(input);
			} else {
				return String(input);
			};
		};

		if(this.hasOwnProperty(ary[0])){
			if(ary.length == 1){ // not array element
				elm = stringify_to_DIScsvParam(this[key]);

			} else {
				key = ary[0];
				let i = ary[1];
				elm = stringify_to_DIScsvParam(this[key][i]);

			};
		} else { // if key is undefined, return "0"
			elm = "0";

		};
		return elm
	};

};


const TREETYPE_TEMPLATE = 0,
	TREETYPE_TRP = 1,
	TREETYPE_TECH = 2;

class DATA_tree extends DATA_entity {
	constructor(id,typ,tree){ // {string}
		super(id);
		this.TREETYPE = typ;

		// inherit DATA_troop object
		DATA.makeDataInherit(this,"TREETEMP",tree);
		// copy given troop template
		DATA.giveSrcParamToData(this,tree);

		/*
		if (tree.hasOwnProperty("INHERITS")){ // if inheritance setting exists
			this.INHERITS = tree.INHERITS;
			deblog(`inherit ${this.INHERITS}`)
			let ptr2ParentTree = DATA.TREETEMP[this.INHERITS];
			for (let aryname in ptr2ParentTree){
				if (typeof ptr2ParentTree[aryname] == "object"){
					let clone = [];
					for (let elm of ptr2ParentTree[aryname]){ // make clone
						clone.push(elm);
					};
					this[aryname] = clone; // save clone of array of parent tree
				};
			};
		};
		*/

		// copy given tree template
		/*
		for (let key in tree){
			if (typeof key == "object"){ // copy only array
				let clone = [];
				for (let elm of tree[key]){ // make clone
					clone.push(elm);
				};
				this[key] = clone; // save new clone of array of parent tree
			} else {
				this[key] = tree[key]; // copy numbers and strings
			};
		};
		*/

		let idcontainer;
		// finally replace idtokens with number id
		if (typ == TREETYPE_TRP){
			idcontainer = trpid

		} else if (typ == TREETYPE_TECH){
			idcontainer = techid

		} else {
			idcontainer = 0
		};

		if (idcontainer != 0){ // debug
			for (let Ary in this){
				if (typeof this[Ary] == "object"){
					this[Ary] = parse_DISData_IdArray(this[Ary],idcontainer);
				};
			};
		};

		
	};	

};


// template class for factions
class DATA_faction extends DATA_entity {
	constructor(id){
		super(id);
		this.minors = [0]; // you can set minorfactions to each faction. (like Dracos, Dranas) but minors[0] must be always blank - I mean number 0.
	};

	trpTree = {}; // you need to import tree from json template 
	techTree = {}; // you need to import tree from json template 

	getTroopTree(){
		return JSON.parse(JSON.stringify(this.trpTree));
	};

	getTechTree(){
		return JSON.parse(JSON.stringify(this.techTree));
	};

};



// template class for troops
class DATA_troop extends DATA_entity {
	constructor(id,src){
		super(id);
		// inherit DATA_troop object
		DATA.makeDataInherit(this,"TROOP",src);
		// copy given troop template
		DATA.giveSrcParamToData(this,src);

		const pewpew = (key,idcon) => {this[key] = typeof this[key] != "number" ? idcon[this[key]] : this[key]};
		// convert strings to DIS number id
		pewpew("faction",facid);
		pewpew("race",raceid);


		// convert arrays into simple number
	};

};

class DATA_troop_csv extends DATA_entity { // shadow of csv troops. doesn't have any value unless it's referred
	constructor(id,index){
		super(id);
		this.i = index;
	};

	/**
	 * called by INHERITS proc.
	 * @method deploy
	 */
	deploy(){
		
	};
	
};


// skin data for troop
class DATA_skin extends DATA_entity {
	constructor(id,src){
		super(id);
		this.i = index;
		// copy given troop template
		DATA.giveSrcParamToData(this,src);
	};

};


// template class for troops
class DATA_tech extends DATA_entity {
	constructor(id,src){
		super(id);
		// inherit DATA_tech object
		DATA.makeDataInherit(this,"TECH",src);
		// copy given troop template
		DATA.giveSrcParamToData(this,src);

		// convert arrays into simple number
	};

	getFlagAddress(){
		// [address,flag]
		let retme = [this.techflagslot[0],parseInt(this.techflagslot[1],16)];
		return retme;
	};

};
// ------------------------------------------------
// DIS objects
// ------------------------------------------------

// DISentities on js system are not real parameters of DIS agents in the game. 
// It's rather something like a bundle of links to actual entities on RPGMaker.
// so unless you refresh its information through functions, data in DISentity can be diffrent from the actual value stored in RPGMaker. 

class DISentity { // prototype for DIS RPGmaker Object
	constructor(){
		this.class = "DISentity";
		this.receivedStorage = []; // given from CmdReturn
		this.isAwaitingReturn = false;
		this.receivedSth = false;
		this.activated = false;
		this.isCertified = false; // turns true after checking essential value integrity with actual game data on RPGmaker
	};

	receiveFromCmd(stuff,sendwhat){
		if (stuff != null){ // at least received something.

			let address = this.getWhereToStorage(sendwhat);

			if (typeof address == "undefined"){
				this.receivedStorage.push(stuff); // store in array

			} else {
				this.receivedStorage[address] = stuff;

			}
			this.receivedSth = true;
			deblog(`DISentity: received ${stuff}`);
		} else { // got null
			errorlog("DISentity: Receiving return value from DIS command process on TPC failed.");
		};
		this.isAwaitingReturn = false;
	};

	getWhereToStorage(gtwut){ // override me, but beware, this function must always return int index for receivedStorage array.
		return "undefined";
	}

	getClass(){return this.class;};



}

class DISRMpicture extends DISentity { // simple picture object.
	constructor(pid,file,pos){
		super();
		this.class = "DISRMpicture";
		this.pid = pid;
		this.file = file;
		this.pos = pos || [0,0]; // [x,y]
		
	}
	size = [0,0];

	refreshPicInfo(){
		let result = this.receivedSth;
		deblog("pictureinfo - try refreshing");
		if(result){
			let arr = this.receivedStorage;
			let i = this.getWhereToStorage(RMarray);

			this.activated = true; // if once get refreshed infomation, this is now activated object on DIS js system.
			this.pos = [arr[i][0],arr[i][1]];
			this.size = [arr[i][2],arr[i][3]];
			this.receivedStorage[i] = 0; // init storage?
			deblog(`pic info refreshed! pos[${this.pos}] size[${this.size}]`);
		}
		let reford = Cmd.ui.getPictureInfo(this.pid); // call DIS cmd and get link
		reford.setLink(this); // ckReceived is now false
		return result;
	};

	// {int} if array is given, store it in [0]. temp.
	getWhereToStorage(gtwut){
		let i;
		if (gtwut == RMarray){ 
			i = 0;
		}
		return i;
	}

	kill(){
		Cmd.game.pic.remove(this.pid);
		this.activated = false;
	};

}

class DISagent extends DISentity { // agents for RTS mode 
	constructor(agentid,unitid,team,isCertified){
		super();
		this.agentid = agentid; // only if agent id is secured, then no problemo.
		this.class = "DISagent";
		// this.agenttype = type;
		this.unitid = unitid;
		this.team = team;
		this.activated = true;
		this.isCertified = isCertified; 

		// register to the world array
		RTS.agents[agentid] = this;
		
	};

	ckIntegrity(){ // check data integrity
		Cmd.agent.ckIntegrity(this);
	};

	getid(){return this.agentid;};

	// {int} 1~300
	getAgentSlot(slot){ // just get slot value.
		let res = null;
		if (1 <= slot && slot <= 300){ // safety
			res = getv((slot + DIS.agent.getPtrToMainParam(this.getid()))); // get agent slot/
		} else {
			errorlog(`Invalid agent slot[$] is refered for ${this.agentid}`);
		};
		return res; 
	};

	isAlive(){ // check if the agent is alive
		if(getv((1 + DIS.agent.getPtrToMainParam(this.agentid))) > 0){
			return true;

		} else {
			return (this.activated = false);

		};
	};

}

class DISagent_static extends DISagent {
	constructor(agentid,buildingid,team,isCertified){
		super(agentid,buildingid,team,isCertified);
	};
	
}

class RTSagentGroup { // list object for DISagent.
	constructor(agtArray,team){
		this.idlist = [];

		// this design can make terrible error in future? idk 
		if (typeof agtArray[0] == "object"){ // if DISagent is set in agtArray
			this.agentlist = agtArray; // save agentlist
			for (let elm of agtArray){
				this.idlist.push(elm.getid()); // save agentid
			} 
			
		} else { // otherwise, just make only idlist
			this.agentlist = "undefined";
			this.idlist = agtArray;
		}
		
		this.team = team || "undefined";
	};

	info = {
		Schewerpunkt: [0,0],
	};

	pushAgent(agt){
		this.agentlist.push(agt);
	}

	compoundAgtGroup(grp){
		this.agentlist = this.agentlist.concat(grp.agentlist);
		this.idlist = this.idlist.concat(grp.idlist);
	};

	compoundAgtArray(arr){ // underconst
		this.idlist = this.idlist.concat(arr);
	};

	getids(){ return this.idlist; };

	// return tile[X,Y]
	getSchwerpunkt(){
		let SP = [0,0];
		let counter = 0;

		for (let ag of this.agentlist){
			if (ag.isAlive()){ // if it's valid agent
				let pnt = [ag.getAgentSlot(26),ag.getAgentSlot(27)];
				const lv = ag.getAgentSlot(104);
				for (let elmi = 0; elmi < 2; elmi++){
					SP[elmi] += (pnt[elmi] * lv);
				};
				counter += lv;
			};
		};

		for (let i = 0; i < 2; i++){
			SP[i] = (SP[i] /= counter) | 0;
		};

		return (this.Schewerpunkt = SP);
	};

	
};



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
// parse ids and save into container on js
function parse_DISid(line,myArray) {
	const [key, value] = line.split('=');
	myArray.register(key,parseInt(value,10));
};

// without id dictionary
function parse_simpleid(line,myArray) {
	const [key, value] = line.split('=');
	myArray[key] = parseInt(value,10);
};

function parse_languageString(line,myArray) {
	const [key, value] = line.split('|');
	myArray[key] = value;
};




function parse_DISData_IdArray(ary,dict){
	let res = [];
	let i = 0; // index for debug
	for (let elm of ary){
		if (typeof elm == "string"){
			try {
				res.push(dict[elm]); // search and push numerical id from given dictionary
			} catch (error) {
				errorlog(`ID token "${elm}" is invalid. Replaced it with -1.`)
				res.push(-1);
			}

		} else if (typeof elm == "number"){
			res.push(elm); // just push
			
		} else {
			errorlog(`parse_DISData_IdArray(${ary},${dict}) - Illegal object is found in given array[${i}].`)

		};
		i++;
	};
	return res;
};


function make_Array_DIStable(array) {
	let string = "";
	for (let elm of array) {
				if (typeof elm == "object"){
					string += make_Array_DIStable(elm) + "|";

				} else {
					string += elm + "|";
				};
	};
	// remove the last "|" upon return
	return string.slice(0,-1);
};


// DIS object is basically container for fundamental data of DIS on quickjs.
// Whenever you want to access DIS game data, the DIS object serves you as a way to get/set the data..
//

var DIS = DIS || {};

const Adrt_ShLog = 782; // same as Shell Log address 

// should I make them const?
class IDdict {
	constructor(prefix){this.prefix = prefix + "_";}
	reserved = new Set(["prefix","reserved","convert","register"]); // never change

	/**
	 * convert given key to int.
	 *
	 * @method convert
	 * @param {string OR int} given
	 * @return {int} 
	 */
	convert(given) {
		let id = given;
		if (typeof given == "string"){
			if (given.lastIndexOf(this.prefix) != -1){
				id = this[given];
			} else {
				errorlog(`"${given}" has no expected "${this.prefix}" prefix!`);
				id = -1;
			};
		};
		return id;
	};

	register(key,val){
		if (this.reserved.has(key)){
			return errorlog(`The name of the new key "${key}" is reserved word for DIS ID dictionary!`);
		};
		return this[key] = val;
	};

};

var trpid = new IDdict("TRP"); // troop ID table
var staid = new IDdict("STA"); // building ID table
var facid = new IDdict("FAC"); // faction ID table
var raceid = new IDdict("RACE"); // race ID table

var techid =  new IDdict("TECH"); // ["techid",[group,flagbit]]

// consts
DIS.consts = {
	
	Adrv:{},
	Adrs:{},

	Adrt: { // address for RM string variables
		TroopCsvDataHead: getv(1215),
	},
	
}

const ADRV = DIS.consts.Adrv
const ADRS = DIS.consts.Adrs
const ADRT = DIS.consts.Adrt

/**
* DIS API object(?) 
*/

DIS = { // DIS fundamental components
	init: {
		
		loadBootconf: () => {
			if (typeof boot_config == "undefined") {
				DIS.log.crash(errorlog("DIS boot config file is broken. Please delete $DISGAMEDIR/Config/boot_config.js and restart the game."));
			} else {

				// bootmode
				if (boot_config.bootmode == 1) { // dev mode
					setv(1265,boot_config.bootmode);
					DEBUG = BOOT_MODE_DEVELOPER
					DIS.log.push("Developer mode activated.");

				} else if (boot_config.bootmode == 114514) { // debug mode
					sets(316,1);
					setv(1265,boot_config.bootmode);
					DEBUG = BOOT_MODE_DEBUG
					DIS.log.push("Debug mode activated.");
				};
				if (DEBUG < BOOT_MODE_DEVELOPER) { devmsg = function(d){}; }; // dummy
				if (DEBUG != BOOT_MODE_DEBUG) { deblog = function(d){}; }; // dummy


				// toggle bootconfig settings 
				DIS.log.push(`Game module:${boot_config.module}`);

				// autosave
				if (boot_config.autosave == 1) {
					sets(317,0);
					DIS.log.push("Autosave activated.");
				} else {
					sets(317,1);
					DIS.log.push("Autosave deactivated.");
				}; 
				
				// autolog?
				DIS.log.push("Autolog function in js file is incomplete, check it out, Johann.");
				if (boot_config.autolog == 1) {
					// sets(317,1);
					DIS.log.push("Autolog activated.");
				} else {
					// sets(317,0);
					DIS.log.push("Autolog deactivated.");
				};

				
				// Particle limit
				let ptcl = Math.min(400,boot_config.particle_amount)
					setv(2215,ptcl)
					DIS.log.push(`RTS particle picture Limit: ${ptcl}`);
				
				// gore effect setting?
				// s[318] <- BOOL_Gore_switch
					sets(318,boot_config.gore)
					DIS.log.push(`Gore VFX switch: ${boot_config.gore}`);

			};
		},

		initID: function(){ // this must be called every after DIS game id is loaded on the game

			/* imported from TPC code - module_core_Game_init.tpc
			 *
				t[803] .asg  .file "..\scripts\const_factions_id", .utf8
				t[804] .asg  .file "..\scripts\const_weapons_id", .utf8
				t[805] .asg  .file "..\scripts\const_shields_id", .utf8
				t[806] .asg  .file "..\scripts\const_armors_id", .utf8
				t[807] .asg  .file "..\scripts\const_helms_id", .utf8
				t[808] .asg  .file "..\scripts\const_accessories_id", .utf8
			*/

			// function for storing ID table
			let store_ID_table = function(table,Adrt){
				let IDstr = gett(Adrt);
				let lines = IDstr.trim().split(LF);
				let i = 0;
				// parse string to array
				lines.forEach(line => { parse_DISid(line,table); i++;});
				initIDlog(i,Adrt);
				return i;
			}

			const initIDlog = function(amount,type){
				let text = "DIS.initID():";
				if (amount > 1){
					if (type == 801){
						text += `TroopID loaded - ${amount} troops are preset`;
					} else if (type == 802) {
						text += `StaticID loaded - ${amount} statics are preset`
					} else if (type == 803) {
						text += `FactionID loaded - ${amount} factions are preset`
					} else if (type == 810) {
						text += `TechID loaded - ${amount} techs are preset`
					} else {
						text += "unknown RM str is loaded."
					}
				} else { // load amount is below 0
					text += `loading process t[${type}] seemingly failed. Check integrity of const_*.txt files.`
					errorlog(text);
				}
				return DIS.log.push(text)
			}
			// --------------------
			// load race ID
			// --------------------

			// temp
			raceid.RACE_humankind = 0;
			raceid.RACE_goblin = 1;
			raceid.RACE_ork = 2;
			raceid.RACE_dragon = 3;
			raceid.RACE_undead = 4;
			raceid.RACE_skeleton = 5;
			raceid.RACE_minotaur = 6;

			// --------------------
			// load troop ID
			// --------------------
			// you can use troopID by writing like this: trpid["TRP_sushi_kensei"] 
			trpid = new IDdict("TRP"); // init trpid
			DIS.data.TROOP.count = store_ID_table(trpid,801); // get from ~/scripts/const_troops.

			// --------------------
			// load static ID
			// --------------------
			staid = new IDdict("STA"); // init staid
			store_ID_table(staid,802) // get from ~/scripts/const_statics.

			// --------------------
			// load faction ID
			// --------------------
			facid = new IDdict("FAC"); // init facid
			store_ID_table(facid,803) // get from ~/scripts/const_factions.
			
			// ~DATA converted from DIS json START~

			// --------------------
			// load tech ID
			// --------------------
			
			techid = new IDdict("TECH"); // init facid
			for (let i = 1; i < DATA.TECH.ptrs[0]; i++){
				techid.register(techid.prefix + (DATA.TECH.ptrs[i].id),i);

			};

					
			DIS.log.push("ID table init done.")
		},
	},

	reload: function(){
		this.initID(); // restore ID 

	},

	// DIS game consts - never touch here blease?
	RTSFPS: 48, // can be changed 
},

DIS.macro = {
	timeToFrame: (h,m,s) => ((h * 3600 + m * 60 + s) * DIS.RTSFPS), 
};

//
DIS.building = {

};

DIS.log = {
	// push background log
	crash: function(error){
		const day = new Date();
		const file = "user/log/crashlog_" + day.getFullYear() + "_" + day.getMonth() + "_" + day.getDate() + "_" + day.getHours() + "_" + day.getMinutes()
		DIS.log.push(error);
		Cmd.game.exportText(Adrt_ShLog,file);
		Cmd.game.pic.load(error,999); // force crash
		deblog(file);
	},

	push: function(txt){
		let curlog = gett(Adrt_ShLog);
		curlog += LF + txt;
		sett(Adrt_ShLog,curlog);
		deblog(txt); // deb
	},
	
};

// font addresses for DIS
const Adrt_FontCommon = 529,
	Adr_FontCommonSize = 4510,
	Adrt_FontUI = 530,
	Adr_FontUISize = 4511;


DIS.lang = {
	init: function(){ // this function called whenever player changes game language...
		// unco
	},


	// ??? is there any necessity of not using Object but array? 
	currentFontdata: {
		common: [gett(Adrt_FontCommon),getv(Adr_FontCommonSize)],
		ui: [gett(Adrt_FontUI),getv(Adr_FontUISize)],
		imperial: [],

	},
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

	// LEGACY map string
	getMapstr: function(id) { // ?
		const Adrt_mapstr_head = 40000
		var string = gett(Adrt_mapstr_head + id);
		return string;
	},

	// convert js string to show into DIS format string
	convertString: function(given){

		let rs = given;
		let rsget = rs;
		if (rs.lastIndexOf('$mstr_') == 0){
			rs = rs.split("$mstr_")[1];
			rsget = RTS.mission.strings[rs];
		} else if (rs.lastIndexOf('$qstr_') == 0){
			rsget = rs.split("$qstr_")[1];
			// underconstruction
		};
		if (typeof rsget == "undefined") { errorlog(`Map string "${rs}" is not registered.`); rs = "undefined";
		} else {
			rs = rsget;
		};

		// let the in game string can reffer js variables
		// unco
		rs = rs.replace(",", "$;");
		return rs // DIS format comma.

	},


	// return given char is CJK or not

	isJapaneseChar: function(char) {
		const charCode = char.charCodeAt(0);
		return (
			(charCode >= 0x3000 && charCode <= 0x30ff) || // ひらがなとカタカナ Hiragana and Katakana
			(charCode >= 0x4e00 && charCode <= 0x9faf) || // CJK統合漢字 Kanji
			(charCode >= 0xff00 && charCode <= 0xffef)    // フルワイドのASCIIと半角・全角の形 other 2bytes char
		);
	},


	/**
	 * DIS.string.wrapText 
	 * returns LF inserted text .. needs to be improved for dealing with latin alphabet languages
	 * maybe add some new proc that attempts to go back to the last blank index I suppose? - TokyoHuskarl 
	 *
	 * @param {string} text
	 * @param {int} fontSize
	 * @param {int} maxWidth
	 * @returns {string} adjusted text
	 */
	wrapText: function(text, fontSize, maxWidth) {
		const englishCharWidth = fontSize * 0.5; // 英語文字の推定幅 supposed width of Latin Alphabet
		const japaneseCharWidth = fontSize * 0.9; // 日本語文字の推定幅 supposed width of 2bytes char
		let currentLine = '';
		let currentLineWidth = 0;
		let wrappedText = '';

		for (const char of text) {
			const charWidth = this.isJapaneseChar(char) ? japaneseCharWidth : englishCharWidth;

			if (char === '\n' || (currentLineWidth + charWidth) > maxWidth) {
				if (currentLine !== '') {
					wrappedText += currentLine + '\n';
					currentLine = '';
					currentLineWidth = 0;
				};
				if (char !== '\n') {
					currentLine += char;
					currentLineWidth += charWidth;
				};
			} else {
				currentLine += char;
				currentLineWidth += charWidth;
			};
		};

		if (currentLine.length > 0) {
			wrappedText += currentLine;
		};

		return wrappedText;
	}

}




const Adr_ptr_spawnAgent = 201; //v[201]

DIS.agent = { 
	// get from game variable
	limit: getv(1004), 
	genPtrPos: 0,

	// Search Empty Space function - this function searches a blank space for an agent in the agent data space.
	// BUT, it has several problems:
	// 1. It must be very slow.
	// 2. How can it sync the result after inserting some Cmd.game.wait(n)?
	// so this needs improvement anyway I suppose...

	searchEmptySpace: function(){ // this must be fugging slow. just experimental 

		// if spawn cmd is not called yet in this frame, getptr.
		if(!Cmd.runFlags.SpawnDetect){this.genPtrPos = getv(Adr_ptr_spawnAgent); Cmd.runFlags.SpawnDetect = true;}
		let emptyspaceID = -1; // if the AgentSpace is full, return -1

		for (let i = 0; i < this.limit; i++){
			let p = 5001
			this.genPtrPos %= this.limit; // compared to ternary operator, which is faster?
			p += this.genPtrPos * 300
			this.genPtrPos++; // this increment position is correct since if it's empty, the actual slot ID is (genPtrPos + 1)
			if (getv(p) <= 0){
				emptyspaceID = this.genPtrPos;
				break;
			};
		};

		return emptyspaceID;
	},

	getPtrToMainParam: (id) => {return 4700 + id * 300;},

	getMainParam: function(id,slot){return getv(this.getPtrToMainParam(id) +slot);},


	// BROKEN
	ck_if_alive(agentid){
		ptr = this.getPtrToMainParam(agentid);
		ptr += 1; // refering to agenttype slot. If *ptr > 0, the agent is seen alive.
		// how about checking unique genid?
		return (getv(ptr) > 0);
	},

	setName: function(agentid,name) {
		
	},

	

}


DIS.player = {
	
}

DIS.control = {


};


// set DATA global pointer

function createKeyArrayFromCsvLine(tmp){
	let elms = tmp.trim().split(",")
	let elmary = [];
	elms.forEach(elm=>{elmary.push(elm);});
	return elmary;
}

DIS.data = { // DIS.data
	csvtemp: {
		TROOP: createKeyArrayFromCsvLine(`id,name,agentDefaultGrp,agentType,agentSprite,race,skin,size:0,size:1,faction,passiveId,unitclass,Lv,HP,SP,AD,AP,AR,MR,HIT,EVA,Crit,MS,WILL,MainWeapon,WEPvariations,Shield,SHDvariations,Armor,AMRvariations,Helmet,HELvariations,Accessory,ACCvariations,SubWeapon,SubWEPvariations,ReserveSetL,?,ActiveSkill:0,ActiveSkill:1,ActiveSkill:2,ActiveSkill:3,PassiveSkill,Perks1,Perks2,Perks3,Perks4,motionFlags,objFlags,AABits,ExtraSettingEv,ExtraParts,Hpreg,Spreg,AS,MoveTypeBits,AArangeMax,AArangeMin,AAmotiontime,AAcost,AAfunction,reserve,AtkTime,AAarmorEff,AAarmorPen,AAeffect,,AIFlag,spriteOffset_x,spriteOffset_y,,,,,,,,train_speed,food,wood,stone,gold,iconsprite,spawnsound,ex_spawn_cev,Description,Lore`),

	},

	init: function(){
		// this.FACTION.init(); <- rewrite this!
		this.TECH.init();
	},

	// called by Cmd.sys.importData on RM command interpreter
	autoregister: function(obj){
		// kek fucking retarded if nesting
		if(obj.hasOwnProperty("TROOP")){
			for (let trp of obj.TROOP){
				this.TROOP.register(trp);
			};
		};

	},

	/**
	* @method parseDISjson
	* @param {string} Raw json string. 
	* @return {object} An object that contains datatype array And the datatype arrays contain source objects for DIS data - still need to be thrown into DATA entity constructors.
	*/
	parseDISjson(src){ 
		let result = {};
		let dataobj = JSON.parse(src);
		deblog(`DIS.data.parseDISjson:`);

		// call this at the beginning of each nest 
		const neststart = (typ)=>{
			deblog(`${typ} data found`);
			result[typ] = result[typ] || [];
			return result[typ];
		};

		for (let typ in dataobj){
			let ptr2Res;

			// FACTION data
			if (typ == "FACTION"){
				ptr2Res = neststart(typ,ptr2Res);
				for (let temp in dataobj[typ]){
					let fac = this.FACTION.createNew(temp);
					let TEMPFAC = dataobj.FACTION[temp]
					if (TEMPFAC.name != ""){
						fac.name  = TEMPFAC.name; 
						fac.color = TEMPFAC.color;
						
						var givenTree = TEMPFAC.trpTree || {};
						fac.trpTree  = new DATA_tree("trpTree",TREETYPE_TRP,givenTree);
						givenTree = TEMPFAC.techTree || {};
						fac.techTree  = new DATA_tree("techTree",TREETYPE_TECH,givenTree);

					}
					ptr2Res.push(fac);

				};

			// TREE TEMPLATE data
			} else if (typ == "TREETEMP"){
				ptr2Res = neststart(typ,ptr2Res);
				for (let strid in dataobj[typ]){
					let type = dataobj.TREETEMP.TREETYPE || 0; //
					let tree = this.TREETEMP.createNew(type,strid,dataobj[typ][strid]);
					ptr2Res.push(tree)
				};

			} else if (typ == "TROOP");{ // troop data 
				ptr2Res = neststart(typ,ptr2Res);
				for (let strid in dataobj[typ]){
					let nutrp = this.TROOP.createNew(strid,dataobj[typ][strid]);
					ptr2Res.push(nutrp);
				};
			}

		};
		deblog("DISjson parsing finished.\n result:")
		deblog(result)
		return result;
	},

	/**
	* @method giveSrcParamToData
	* @param {DATA_entity} data DIS DATA entity that receives parameters copied from src.
	* @param {object} src Source object that generated by parsing json.
	*/
	giveSrcParamToData: function(data,src){
		for (let key in src){
			if (typeof key == "object"){ // copy only array
				let clone = [];
				for (let elm of src[key]){ // make clone
					clone.push(elm);
				};
				data[key] = clone; // save new clone of array of parent tree
			} else {
				data[key] = src[key]; // copy numbers and strings
			};
		};
	},
	
	/**
	 * If given src object imported from json with "INHERITS" property, then copy parent properties to the child data object.
	 * This method is usually called in constructor of DATA entity.
	 *
	 * @method makeDataInherit
	 * @param {DATA_entity} child DIS Data entity that inherits properties.
	 * @param {string} datatype Datatype property under DIS.data, where parent object exists. e.g. "TROOP", "TREETEMP".
	 * @param {object} src Source Object that generated by parsing json.
	 */
	makeDataInherit: function(child,datatype,src){
		if (src.hasOwnProperty("INHERITS")){ // if inheritance setting exists
			const DtypPtr = DATA[datatype];
			let savid = child.id;
			let heritage_array = [src.INHERITS];
			
			// make parent object array until the root object whose INHERITS is blank
			for (let i = 0; DtypPtr.hasOwnProperty(heritage_array[i]) && DtypPtr[heritage_array[i]].INHERITS != ""; i++ ){
				heritage_array.push(DtypPtr[heritage_array[i]].INHERITS);
			};

			// then let current child object inherit
			while (heritage_array.length != 0){
				let what2inherit = heritage_array.pop();
				deblog(`let ${child} inherit ${what2inherit}`)

				let ptr2Parent = DtypPtr[what2inherit];
				for (let aryname in ptr2Parent){
					if (typeof ptr2Parent[aryname] == "object"){
						let clone = [];
						for (let elm of ptr2Parent[aryname]){ // make clone
							clone.push(elm);
						};
						child[aryname] = clone; // save clone of array of parent tree
					} else {
						if (datatype != "TREETEMP") {
							child[aryname] = ptr2Parent[aryname];
						};
					};
				};

			};

			child.id = savid;
		} else {
			child.INHERITS = "";
		};
	},


	
	FACTION: {
		init: function(){
			// load faction template json file in current module directly
			// before running this js file, TPC loads it
			let LOADED_TEMPLATE = JSON.parse(gett(633))["FACTION"]; // <- t[633] is str_moduleData_FacTemplate_json
			let i = 1;
			for (let key in LOADED_TEMPLATE){
				let fac = this.createNew(LOADED_TEMPLATE[key]);
				this.register(fac,i); // even if it's dummy faction, register to as far as it's written in {module}/Data/faction_template.json
				i++;
			};
		},

		ptrs: [0],

		/**
		 * @method createNew
		 * @param {string} strid
		 */
		// rewrite DATA_faction constructor!!
		createNew: function(strid){
			return this[strid] = new DATA_faction(strid); // do not resgister to ptrs yet
		},

  /**
   * register.
   * @method register
   * @param {DATA_faction} Dfac
   * @param {int} index
   */
		register(Dfac,index){
			index = index || this.ptr[0] + 1; // if index is not set,then just push
			this.ptrs[index] = Dfac;
			this.ptrs[0] = this.ptrs.length;
		},

	},

	TROOP: {

		count: 0,
		/**
		 * .
		 * @method createNew
		 * @param {} strid
		 * @param {} srcdata
		 */
		createNew: function(strid,srcdata){
			return this[strid] = new DATA_troop(strid,srcdata); // do not resgister to ptrs yet
		},

		/**
		 * register troop data to id array.
		 * Newly registered data will be pushed into id array.
		 * If you want to add mod troop data to the game, use this method.
		 *
		 * @method register
		 * @param {DATA_troop} trpdata
		 */
		register: function(trpdata){
			let ls4nuTrp = [];
			if (Array.isArray(trpdata)){
				for (let elm of trpdata){
					ls4nuTrp.push(elm);
				}
			} else {
				ls4nuTrp.push(trpdata);
			};

			for (let nutrp of ls4nuTrp) {
				this.count++; // increment troop data counter
				let ck = "TRP_" + nutrp.id;
				if (trpid.hasOwnProperty(ck)) { // override
					this.writeIntoRM(nutrp,trpid[ck])

				} else {
					this.writeIntoRM(nutrp,this.count);
				}
			};
			deblog(this.count);
		},

		/**
		 * convert troop data into actual DIS troop data CSV string on RM system and write it into RPG maker string system.
		 * using this method allows you to override already existing troop data on RM.
		 * If you just want to add mod troop data to the game, you should use DATA.TROOP.register() than this method.
		 *
		 * @param {} index
		 * @param {DATA_troop} trpdata
		 */
		writeIntoRM: function(trpdata,index){
			const where2write = ADRT.TroopCsvDataHead + index;
			deblog("writign nao")
			let idfied = "TRP_" + trpdata.id;
			trpdata.i = index; // set index number into trpid container  
			trpid.register(idfied, index);
			sett(where2write,this.convertIntoCsvLine(trpdata)); // go for it
		},

		convertIntoCsvLine: function(trpdata){ 
			let str="";

			const pushKeyStr = (key) => {
				return trpdata.getElmAsString(key) + ",";
			}; 
	
			deblog(DATA.csvtemp.TROOP)
			for (let elm of DATA.csvtemp.TROOP){
				str+=pushKeyStr(elm)
			};

			deblog(str)
			return str;

		},

	}, 
	STATIC: {}, 
	TECH: {
		init: function(){
			// load faction template json file in current module directly
			// before running this js file, TPC loads it
			
			let LOADED_DATA = JSON.parse(gett(634))["TECH"]; // <- t[634] is str_moduleData_Tech_json
			let i = 1;
			for (let key in LOADED_DATA){
				let tech = this.createNew(key,LOADED_DATA[key]);
				this.register(tech,i);
				i++;
			};

		},

		ptrs: [0],

		createNew: function(strid,srcdata){
			return this[strid] = new DATA_tech(strid,srcdata); // do not resgister to ptrs yet
		},

		// can't we omit this with some js function or etwas?
		register(elm,index){
			index = index || this.ptr[0] + 1; // if index is not set,then just push
			elm.i = index;
			this.ptrs[index] = elm;
			this.ptrs[0] = this.ptrs.length;
		},



	},
	TREETEMP: {
		/**
		 * .
		 * @method createNew
		 * @param {int} typ
		 * @param {string} strid
		 * @param {object} treedata
		 */
		createNew: function(typ,strid,treedata){
			return this[strid] = new DATA_tree(strid,typ,treedata); // do not resgister to ptrs yet
		},

	},
	RACE: {},
	SKIN: {},
	SKILL: {},
	ITEM: {
		WEAPON: {},
		SHIELD: {},
		ARMOR: {},
		HELMET: {},
		ACCESSORY: {},

	},

};

const DATA = DIS.data;


// ------------------------------------------------
// DIS RTS manager
// ------------------------------------------------

// The goal of DIS RTS manager system on Quickjs is just to make the game system more flexible, but not to control everything of DIS with it.
// Why? Because js is too slow to handle everything in DIS system (and stuff of RM2k3).
// All these system is just a help helper for developers.

// Particularly, the restoration process shouldn't be too big to handle with.
// The game itself must be able to go on even without management system on Quickjs if possible. I guess.. - TokyoHuskarl


//
const TEAM_GAIA = -1,
	TEAM_PLAYER = 0,
	TEAM_ENEMY = 1,
	TEAM_NEUTRAL = 2,
	TEAM_ALLY = 3;

const Adr_world_frame = 2510;

const Adrt_JSSAVE_triggersQueue = 763; // <- header_scripts

// DIS system component classes - these class objs usually work as component under RTS objects.

// DISvariable
class DISvariable extends DISentity { // nonvolatile Variable for RTS mission
	constructor(type, address){
		super();
		this.class = "DISvariable";
		this.type = type;
		this.address = address;
		this.value = getv(address);
		this.JSindex = RTS.savedVars.length;
		this.activated = true;
		RTS.savedVars.push(this); // push to RTS savedVars array.

	};

	refresh(){this.value = getv(this.address);};
	get(){return this.value;};
	initset(num){this.value = num;};
	set(num){this.value = num; setv(this.address,num);};
	refget(){this.refresh();return this.value;};
};


// RTSmission Object

class RTSmission {
	constructor(infojson){
		infojson = infojson || "undefined";
			this.RMmapid = 0; // RPGMAKER mapid.
		if (infojson == "undefined"){
			this.RMmapid = -1; // RPGMAKER mapid.
			this.missionid = "NO_missioninfo";
			this.conf = {};
			this.conf.isLEGACYmission = true;
			this.conf.isSightSystemOn = true;
			this.conf.isMoraleSystemOn = true;
			this.conf.isLevelSystemOn = false; // not yet
			this.mapSourceDir = this.missionid;
			this.dataextension = [];

		} else {
			let src;
			try {
				src = JSON.parse(infojson);
			} catch (error) {
				errorlog("missioninfo.json.txt for the current mission seems broken. Check if it's written in correct JSON format.")
				src = {name: "Couldn't read missioninfo.json.txt file for this mission"};
			};
			this.missionid = src.missionid;
			this.name = src.name;
			this.missionscript = src.missionscript || ["mymission.js"];
			this.dataextension = src.dataextension || [];
			this.startcamerapos = src.startcamerapos || [0,0];

			this.playcondition = src.playcondition || [];
			this.dependency = src.dependency || [];
			this.icon = src.icon || "";
			
			this.conf.allows_pick_faction = src.allows_pick_faction || false;
			this.conf.isSightSystemOn = src.sys_sight || false;
			this.conf.isMoraleSystemOn = src.sys_morale || true;
			this.conf.isLevelSystemOn = src.sys_level || false;

			this.conf.isLEGACYmission = src.legacymission || false;

			// set player factions
			let i = 0;
			for (let fac of src.default_factions){
				this.essential.players[i] = new DIS_RTSplayer(i,fac);
				i++;
			};
			this.mapSourceDir = (src.hasOwnProperty("IMPORT_MAP") && src.IMPORT_MAP != "") ? src.IMPORT_MAP : this.missionid;



		};
		sets(457,this.conf.isLEGACYmission); // s[457] <- Is_LEGACYSTAGE
			// console.log("mapdir is "+this.mapSourceDir)
		


		this.allocVarAmount = 0;
		this.essential.mapDataDirectory = this.missionid; // initially set the same as mission
		this.passedFrame = 0; //  if DIS game is reloaded, then reload from RM var. 

	};

	createMissionVar = function(){
		const Adr_MissionVarMemoryHead = 2001; // ACHTUNG
		const VarmemoryLimit = 20; // ?
		let allocated = Adr_MissionVarMemoryHead + this.allocVarAmount;
		if (this.allocVarAmount < VarmemoryLimit){
			this.allocVarAmount += 1;
			return new DISvariable(RMvar,allocated);
		} else {
			Cmd.game.log_error(("Too many mission variables are declared! Current limit is: " + VarmemoryLimit))
			return NULL;
		};
	};

	Cmd = { // mission commands - basically load files from the mission directory
		importData(finame){
			let path = RTS.mission.missionPath + finame; // Str_MissionPath
			Cmd.sys.importData(path);
		},
	};

	local = {}; // mission local instances - restored when you reload the game.
	

	conf = { // these matter only at the setting up mission part
		
		
	};

	missionPath = ""; // get from RM system in RTS.setupMission

	strings = {};
	importLangString(str){
		let lines = str.trim().split("\n");
		lines.forEach(line => {
			parse_languageString(line,this.strings)
		});
		deblog("string imported:\n" + str);
	};
	

	essential = { // these elements must be restored when you reload the game via save/load. <- will be relocated?
		players: [],
		difficulty: getv(2401), // <- RTS_Difficulty
		weatherType: 0,
		// mapDataDirectory: this.mapDataDirectory, // set in constructor
	};

	save = function(){
		// save triggers in queue as a string..
		let savestring = "";
		for (let elmid in this.triggers.queue){
			let i = this.triggers.queue[elmid].index; // get trigger index in RTS.createdTrgs
			savestring += i + ",";
		};
		sett(Adrt_JSSAVE_triggersQueue,savestring.slice(0,-1));

		sett(745,JSON.stringify(this.local)); // Str_Mission_local_save_JSON


	};

	restore = function(){
		// restore mission settings
		this.passedFrame = getv(Adr_world_frame); //  if DIS game is reloaded, then reload from RM var. 
		let saved = JSON.parse(gett(745));
		for (let elmid in saved){
			let elm = saved[elmid];
			if (typeof elm == "object"){
				if (Array.isArray(elm)){ // if it's array
					this.local[elmid] = [];
					for (let elm_b of elm) {
						this.local[elmid].push(elm_b);
					};
				}; // otherwise just ignore, since triggers cannot be saved
			} else {
				this.local[elmid] = elm; // just copy

			};
		};
		
		deblog(JSON.stringify(this.local));
		deblog("RTSmission restored.");
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
	};

	createSimpleTrigger_Timer = function(h,m,s) { // if the set time passed, then call effect()
		let Trig = new RTStrigger();
		let goalFrame = DIS.macro.timeToFrame(h,m,s)
		Trig.condition = function(){
			return (RTS.mission.passedFrame >= goalFrame);
		};
		return Trig;
	};

	createSimpleTrigger_FrameTimer = function(f) { // if the set frame has passed since the trigger set, then call effect()
		let Trig = new RTStrigger();
		Trig.condition = function(){
			this.timer++;
			return (this.timer >= f);
		};
		return Trig;
	};


	setMapData = function(mapdir){ // {string}
		this.mapSourceDir = mapdir;
	};

	setTrigger = function(trig){ // {RTStrigger}
		this.triggers.queue.push(trig);
	};

	setPlayer = function(id,faction){ // set player in mission.
		this.essential.players[id] = new DIS_RTSplayer(id,faction); // push to players array

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
	HGEN_GENERATE = 2,
	HGEN_PRESET_TXT = 3;

class RTSmap {
	constructor(infojson){
		this.size = [50,50]; // temp
		infojson = infojson || "undefined";
		if (infojson == "undefined"){
			this.mapid = "LEGACYMAP";
			this.isGenerated = false;
			this.heightgenType = HGEN_NOTHING; // 
			this.tileset = 1; // RM tile set - if it's not defined, at least try to load 1.
			this.terrainSource = "terrain.png"; // png?

		} else {

			let src;
			try {
				src = JSON.parse(infojson);
			} catch (error) {
				errorlog("mapinfo.json.txt for the current mission seems broken. Check if it's written in correct JSON format or not.")
				src = {name: "Couldn't read mapinfo.json.txt file for this mission"};
			};
			this.name = src.name;
			this.mapscript = src.mapscript || ["mymap.js"];
			this.dataextension = src.dataextension || [];

			this.dependency = src.dependency || [];
			
			// set player factions
			let i = 0;
			for (let elm of src.size){
				this.size[i] = elm;
				i++;
			};
			this.heightgenType = src.heightgen || 0; // kari
			this.terrainSource = src.terrainfile || "terrain.png"; // png?
			this.tileset = src.tileset || 1; // RM tile set - if it's not defined, at least try to load 1.
		};
		



		/*
		mapdeffile = mapdeffile || "editmode";
		this.source = mapdeffile;
		this.size = [50,50]; // temp
		this.isGenerated = false;
		this.heightgenType = HGEN_NOTHING; // 
		this.tileset = 1; // RM tile set - if it's not defined, at least try to load 1.
		this.terrainSource = "mapdata.png"; // png?
		*/
		

	};
	
	
	build(){ // this function called through mission init process, after RTS.openMissionMapDataloading() done after mapdef.js.txt is read.
		const Adr_TileID = 2060;
		const Adr_HeightGenType = 2056;

		setv(Adr_TileID,this.tileset);
		this.generate();
		deblog("build called")
		setv(Adr_HeightGenType,this.heightgenType)
	};
	
	
	init(){return NULL;}; // override me. can be written in mapdef.js.txt.


	restore(){


		deblog("Map restored.")
	}; // call me
	
	generate(){ // if you don't override this function, this object tries to load this.terrainSource unless the map is LEGACYmission - I mean using RMmap.
	
			deblog("how about it?: "+ RTS.mission.conf.isLEGACYmission);
		if (!RTS.mission.conf.isLEGACYmission){
			const Adr_mapTerrainSourceType = 2055;
			let filename = this.terrainSource.split("."); // ignore extension
			if (filename[1] == "png"){
					setv(Adr_mapTerrainSourceType,2);

			} else if (filename[1] == "txt") {
					setv(Adr_mapTerrainSourceType,1);

			};
			deblog(filename[0]+filename[1]);

			filename = filename[0]; // this.terrainSource.split(".")[0]; // ignore extension
			sett(adr_DISstr1,filename) // return to t[501]
		};
	
	};

	gensync(){
	
	};
};
	
class DIS_RTSplayer extends DISentity {
	constructor(id,factionid){
		super();
		this.id = id;
		this.factionid = factionid;
		this.isHuman = false;


		// get troop tree data from
		
		// underconst
		// this.trpTree = DATA.FACTION.ptrs[factionid]();


		// check if it's game player
		if (SINGLEPLAY){
			if (id == 0) { // DIS LEGACY - single player only.
				this.isHuman = true;
				g_PLAYER = this;

			} else if (id == 1) {
				g_ENEMY = this;

			};
		};

		/* set them after faction data load function built in TPC
		this.playergamedata.troopTree = DATA.FACTION.ptrs[factionid].getTroopTree();
		this.playergamedata.techTree = DATA.FACTION.ptrs[factionid].getTechTree();
		*/


	};

	// make json to save
	playergamedata = {
		troopTree: [],
		techTree: [],
		techFlags: new Array(3),
	};


	cohorts = [];

	combatpower = 0;


	getTeamListHead(){return 1145 + Math.min(this.id,1)};
			


	teamAgentsList = [];

	refreshCurrentTeamList(){
		let res = [];
		let agid;
		for (let ptr = getv(this.getTeamListHead()) ; (agid = getv(ptr)) >= 1 ; ptr++ ){
			res.push(RTS.agents[agid]);
		};
		return (this.teamAgentsList = new RTSagentGroup(res,this.id));

	};

	getSchwerpunkt(){ return this.refreshCurrentTeamList().getSchwerpunkt() };

	getCombatPower(){

		let res = 0;
		let agid;

		for (let ptr = getv(this.getTeamListHead()) ; (agid = getv(ptr)) >= 1 ; ptr++ ){
				let lv = (DIS.agent.getMainParam(agid,104) / 3) + 1;
				lv *= lv <= 1 || DIS.agent.getMainParam(agid,260) >= 3 ? 0 : 1 // check morale
				res += lv;
		};

		return this.combatpower = (res | 0);

	};


	receiveTeamList(array){
		this.teamAgentIDlist = array;
	};


	// select agents and return as a idlist
	select_all(){
		let r = [];
		let agid;
		for (let ptr = getv(this.getTeamListHead()) ; (agid = getv(ptr)) >= 1 ; ptr++ ){
			r.push(agid);
		};
		deblog(r);
		return r;
	};

	restore(){ 
		// restore tech info
	};

};

class DIS_cohort extends DISentity {
	constructor(team,id,agtarray){
		super();
		this.team = team;
		this.id = id;
		this.agents = agtarray;
		
		MISSION.essential.players[team].cohorts[id] = this;

	};

};



// RTStrigger - old simple trigger.
// maybe you need to build up restoring processes for mission and triggers.
// both creation and deletion of the simple triggers must be memorized in RMvar (or str) just for restoring save data. After all.
class RTStrigger {
	constructor(){
		this.index = RTS.createdTrgs.length; // push this to created Triggers Array in RTS
		RTS.createdTrgs.push(this); // push this to created Triggers Array in RTS
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

	finishLoop(){this.isLoop = false};

};


class DIS_dialog extends DISentity{
	constructor(string,time,icon){
		super();
		this.showframe = time | 235; // if showframe is -1, it won't automatically disappear until forceSkipDialog() or clearDialogQueue() is called
		this.opensound = ["cursor09",75,90,50] // file vol tempo balance
		this.icon = icon || ["",[4,4],1]; // [filename, sprite_number, and?]
		this.fontdata = DIS.lang.currentFontdata.common; // [filename, fontsize]
		this.stopworld = false; // 
		this.size =  [360,78] // [240,64]; // [360,108] [width,height]  isn't this changed?

		// automatically insert LF
		this.string = DIS.string.wrapText(string,this.fontdata[1],this.size[0]);

		

	};
	

	afterEffect(){/* override me*/}; // called after this one is overino
	setIcon(filename,spritenum){
		
	};
};



// ------------------------------------------------
// DIS RTS object
// ------------------------------------------------

const Adrt_dialogQueue = 785 // -> Game_script_general.tpc
const Is_SightSystem_On = 300; // <- header_common.tpc
const Adrt_mapdirectory = 755;

let RTS = {
	isRTSmode: false,
	mission: new RTSmission(),
	map: new RTSmap(),
	createdTrgs: [],
	savedVars: [],
	agents: new Array(DIS.agent.limit), // store mission vars or whatever

	/*
	Mtrig: {}, // mission triggers
	Mvar: {}, // mission vars
	Mbool: {}, // mission switch
	Mstr: {}, // mission strings
	*/

	path: { // instances relating to pathfinding or agent movement order. properties won't be restored on loading savegame.
		init: function(){
			for (let i = 0; i < DIS.agent.limit; i++){
				this.PfWPbuffer[i] = [];
			};


		},

		mvgrp: [], // agent movement group

		PfWPbuffer: [], // node array stored for each agents 
		storePath: function(agentid,PathArray){ // usually called on TPC
			this.PfWPbuffer[agentid] = PathArray; // send PathArray to RTS.path.PfWPbuffer.
			let t = "RTS.path: stored " + PathArray; // tesT
			deblog(t);

		},


		initPath_list: function(agentidlist){ 
			for (let agt of agentidlist){
				this.PfWPbuffer[agt] = [];
			}
		},

		givePath: function(agentid){ // give stored path to the agent. array length after this is returned.
			
			let buf = this.PfWPbuffer[agentid];
			let len = buf.length;
			if (len <= 0) {return -1} // if there's no elements stored (it can happen after loading savegame) break and return -1. 

			let cnt = Math.min(len,6);
			let i;
			let path = [cnt]; // path[0] = cnt of this
			for (i = 0; i < cnt; i++){ // pick up nodeid from head of stored array
				path[i + 1] = buf.shift();
			};

			if (isNaN(path)){return -1}; // if generation of path array failed, return -1

			setv(22,path); // deploy path array to reg2 ~ reg9. 
			let t = "RTS.path: give " + path + " to id:" + agentid; // tesT
			deblog(t);
			return (len - i); // return to reg1 (expected)
		},

		copyPath: function(agentid,targetid){
			deblog(agentid + " to " +targetid) 
			this.PfWPbuffer[targetid] = []; // ? should I use let?

			for (let elm of this.PfWPbuffer[agentid]) {
				this.PfWPbuffer[targetid].push(elm);
				// deblog(elm)
			};
		},


		convertArrayIntoPath: function(array){
			

		}




	},


	DlogManager: {
		queue: "",
		receiveQ: function(){ // whenever you deal with Dialog Queue, you have to get current DialogQueue from RM
			this.queue = gett(Adrt_dialogQueue);
		},
		sendQ: function(){
			sett(Adrt_dialogQueue,this.queue);
		},
		afterEffects: [],
	},

	init: function(){
		this.mission = new RTSmission();
		this.map = new RTSmap();
		this.isRTSmode = false;
		this.global = {}; // mission triggers
		this.createdTrgs = []; // mission triggers
		this.savedVars = []; // mission vars
		this.path.init();
		deblog("RTS obj init.")
	},

	openMission: function(jsonstr){ // "openmap" command in the old DISshell.
		this.mission = new RTSmission(jsonstr);
		this.isRTSmode = true;
		this.path.init();
		
	},

	// if you do this on Cmd interpreter, then this function is not even needed I suppose
	setupMission: function(jsonstr){ //
		if (!(this.isRTSmode)){ // if the isRTSmode flag is not yet set (legacy maps) reopen DISmission
			this.mission = new RTSmission(jsonstr);
			deblog(`RTS.setupMission() - json loaded`);
			this.isRTSmode = true;
		}

		if (this.mission.RMmapid == 0 || this.mission.RMmapid == 60 || this.mission.RMmapid == 61) { // NOT RPG maker legacy map
			// then we're gonna open custom map.
		} else { // RPG maker legacy map. 
			// so be it.
			this.mission.conf.isLEGACYmission = true;
		}

		this.mission.missionPath = gett(749); // Str_MissionPath

		MISSION = this.mission; // set link to current mission
		LOCAL = MISSION.local;

		// import mission data extension
		for (let elm of MISSION.dataextension){
			MISSION.Cmd.importData(elm)
			deblog(`RTS.setupMission() - extension file ${elm} loaded`);
		};
		Cmd.run();


	},

	setupMapLoading: function(mapdir){ // will be called after this.setupMission().
		// sightsystem setting
		sets(Is_SightSystem_On,this.mission.conf.isSightSystemOn);
		
		// set map name into RMstr
		sett(Adrt_mapdirectory,mapdir);
		deblog(`${mapdir} will be loaded. (t[${Adrt_mapdirectory}])`)
		
	},

	openMissionMapData: function(jsonsrc){ // you can call this only after successfully load missiondef.js.txt..
		deblog("missionmapdata is called")
		this.map = new RTSmap(jsonsrc);
		MAP = this.map;
		// send back mapsize reg1 reg2
		setv(21,MAP.size[0])
		setv(22,MAP.size[1])
		deblog("sent back size array to reg1 and reg2")
		
	},


	save: function(){ // called whenever the game is trying to make RM savefile...
		
		this.mission.save();
		deblog("saved :D")

	}, // unco

	// RTS.restore
	restore: function(){ // call this function whenever player loads RMsavedata. reload all data from RM memories.
		// restore mission 
		this.setupMission(gett(741)); // read mission info json file stored in the savedata
		const str_missiondef_storage = 761; // <- header_mission.tpc

		// load mission def and setup map system
		eval(gett(str_missiondef_storage)); // using eval is kinda risky, but still, I have no choice under 2003Maniacs I suppose
		this.mission.conf.isSightSystemOn = gets(Is_SightSystem_On); // setupMapLoading

		this.mission.restore(); // start actual restoration

		// restore map
		this.openMissionMapData();
		const str_mapdef_storage = 762; // <- header_mission.tpc.. is this even necessarily?
		this.map.restore();


		// restore js variables in RTS object
		for (let elm of this.savedVars) { // restore each of nonvolatileVar in this.savedVars
			elm.refresh(); // get RPG maker var
			deblog(elm.address);
		};

		deblog("js variables restored..")

		// restore simple triggers in RTS object
		this.mission.triggers.queue = []; // init triggers
		let savedtrgStr = gett(Adrt_JSSAVE_triggersQueue); // get saved array
		let trgQArray = savedtrgStr.split(",").map(str => parseInt(str, 10)); // convert into init array

		for (let i of trgQArray){ // check it
			if (typeof this.createdTrgs[i] == "object") { // failsafe
				this.mission.triggers.queue.push(this.createdTrgs[i]); // re-push trigger to the trigger queue.
			};
		};
		deblog("simple triggers restored..");

		deblog(`${this.createdTrgs.length} triggers exist in mission.`);
		deblog(`and currently ${this.mission.triggers.queue.length} triggers are active. `);

		// path data array init
		this.path.init();

		// Dlog?
		this.DlogManager.receiveQ(); // restore Dlog queue
		
	},




};




// ------------------------------------------------
// DIS Command Object
// ------------------------------------------------

// DIS Command types -> module_Game_scripts_functions.tpc
const CTYP_MAP = 1,
	CTYP_SYS = 2,
	CTYP_MISSION = 3,
	CTYP_GAME = 4,
	CTYP_AGENT = 5,
	CTYP_PLAYER = 6,
	CTYP_GROUP = 7,
	CTYP_UI = 8,
	CTYP_END = 999;


// DIS Command string container <- module_Game_scripts_functions.tpc
const LINKSTR_map = 771,
	LINKSTR_sys = 772,
	LINKSTR_mission = 773,
	LINKSTR_game = 774,
	LINKSTR_agent = 775,
	LINKSTR_player = 776,
	LINKSTR_group = 777,
	LINKSTR_ui = 778,
	LINKSTR_END = 779;


// -> module_Game_scripts_general.tpc
const adr_RMbool_RUN_CMD = 132,
	adr_RMStr_CmdOrder = 795;

class CmdRetLink {
	constructor(typ){
		this.index = Cmd.ReturnQueue.length;
		this.type = typ || RMvar; // if not given, consider it as a RMvar.
		this.received = false;
		this.value = 0;
		Cmd.ReturnQueue.push(this);
	};

	receive(s){
		this.value = s;
		this.received = true;
	};

	setLink(DISRMo){
		this.link = DISRMo;
		this.link.isAwaitingReturn = true;
		this.link.receivedSth = false;
	} // one directional link.

	send(sendwhat){ // send its value to Linked DISRMobject
		let result = false;
		if (this.received && (typeof this.link == "object")){
			
			this.link.receiveFromCmd(this.value,sendwhat);
			result = true;
		} else {
			this.link.receiveFromCmd(null,sendwhat); // tell the object that getting return value was miserably failed 
		};
		deblog(`Link sending back - ${result}`) 
		return result;
	};
	
}



// DIS Command Object
// (Almost) all command functions in objects in the Cmd object will be executed on RM interpreter, not on js process.
var Cmd = {
	// DIS command
	CmdQueue: "",

	ReturnQueue: [],
	sendback: function(stuff,linki,sendwhat){ // this function is to be called by TPC. send RM stuff back to ReturnQueue.
		deblog(`RetLink:sending back thing ${stuff} to returnArray[${linki}]!`)
		deblog(`${Cmd.ReturnQueue[linki]} is receiver.`)
		Cmd.ReturnQueue[linki].receive(stuff);
		deblog(`RetLink:received successfully, now to send...`)
		sendwhat = sendwhat || 0; // if 0, not designated what to send.
		Cmd.ReturnQueue[linki].send(sendwhat);
	},

	restore: function(){ // call this function when the game loads savedata
		this.runFlags.initAll();
	},

	CmCon: {}, // command name associative array


	/**
	 * command order Queue set.
	 *
	 * @param {CTYP} typ
	 * @param {string} name
	 * @param {string} ord
	 */
	Qset: function(typ,name,ord){
		let cmdid = Cmd.CmCon[name];
		Cmd.CmdQueue += (typ + "," + cmdid + "," + ord + ";");
	},
	
	runFlags: {
		SpawnDetect: false, // init this flag
		RMwaitDetect: false, //
		CalledDialogQueue: false, //
		spawnagent_lastdir: 0,

		initAll: function() {
			this.SpawnDetect = false;
			this.RMwaitDetect = false;
			this.CalledDialogQueue = false;
			Cmd.group.cgrp = [];
		},

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
					parse_simpleid(line,this.CmCon);
			});
		}

	},

	// Cmd.run()
	// give signal to run DIS commands 
	run: function() {

		// give raw cmd as a string to RPGMaker
		sett(adr_RMStr_CmdOrder,this.CmdQueue);
		// turn on RM switch to run interpreter as cev
		sets(adr_RMbool_RUN_CMD,1);
		// deblog(Cmd.CmdQueue)
		Cmd.CmdQueue = ""; // initialize Command Order
		 
		// return queue is cleared after TPC finishes actual Cmd processes
		this.runFlags.initAll();
	},
	

	// actual command objects start 
	//Cmd.game
	game: {
		CmdType: CTYP_GAME,


		playGlobalSE: function(file,vol,tempo,ballance) { // "cmd_play_global_sound"
			Cmd.Qset(this.CmdType,"pGSE",`${file},${vol},${tempo},${ballance}`);
		},

		playBGM: function(file,vol,tempo,ballance) { // "cmd_play_global_sound"
			Cmd.Qset(this.CmdType,"pBGM",`${file},${vol},${tempo},${ballance}`);
		},
	

		wait: function(RMwaittime) { // RMwaittime: 10 = 1sec, 0 = 1f, -n = {n}f. 
			Cmd.Qset(this.CmdType,"wait",`${RMwaittime}`);
			Cmd.runFlags.RMwaitDetect = true;
		},

		pic: { // Cmd.pic
			CmdType: CTYP_GAME,

			load: function(filepath,picid) { // load to picid 
				Cmd.Qset(this.CmdType,"loadPic",`${filepath},${picid}`);
				return (new DISRMpicture(picid,filepath)); // no pos gg
			},

			remove: function(picid) {
				Cmd.Qset(this.CmdType,"removePic",`${picid}`);
			},
		},

		loadText: function(filepath) { 
			Cmd.Qset(this.CmdType,"loadText",`${filepath}`);
		},

		exportText: function(stringid,filepath) {
			Cmd.Qset(this.CmdType,"exportText",`${stringid},${filepath}`);
		},

		tintScreen: function(RGBS,f) {
			f = f || 0;
			let st = RGBS.join(",") + "," + f;
			Cmd.Qset(this.CmdType,"tintScreen",st);
			deblog(st)
		},

		gotoRMmap: function(RMmapid,tilepos) { //
			tilepos = tilepos || [0,0]
			Cmd.Qset(this.CmdType,"gotoRMmap",`${RMmapid},${tilepos[0]},${tilepos[1]}`);
		},


		// log series

		// unlike Cmd.game.log, argument will be processed by DIS.string.convertString() 
		msg: function(txt){
			txt = DIS.string.convertString(txt)
			Cmd.Qset(this.CmdType,"msg",`${txt}`);
		},

		log: function(txt){
			Cmd.Qset(this.CmdType,"msg",`${txt}`);
		},

		log_error: function(txt){
			let t = `\\C[17]ERROR:${txt}`;
			Cmd.Qset(this.CmdType,"msg",t);
			return t;
			// deblog("`ERROR:${txt}`")
		},

		log_dev: function(txt){
			let t = `\\C[1]Dev:${txt}`;
			Cmd.Qset(this.CmdType,"msg",t);
			return t;
		},	

		log_debug: function(txt){
			let t = `\\C[5]JS DEBUG:${txt}`;
			Cmd.Qset(this.CmdType,"msg",t);
			return t;
		},	
		
		//


	},

	//Cmd.map
	map: {
		CmdType: CTYP_MAP,
		
		

		
		/* spawnerInfoUpdate: ()=> {
			if (Cmd.bl_SpawnCmdCalled == false){}
		} need to consider well */ 

		// {int}, array[x,y]
		spawnAgent: function(troopid,tilepos,team,dir,stance,flag){ // returns DISagent
			troopid = trpid.convert(troopid);
			dir = dir || Cmd.runFlags.spawnagent_lastdir;
			stance = stance || 0;
			flag = flag || 0;
			
			Cmd.Qset(this.CmdType,"spnAg",`${troopid},${tilepos[0]},${tilepos[1]},${team},${dir},${stance}`);
			let protoagent = new DISagent(DIS.agent.searchEmptySpace(),troopid,team,false);

			Cmd.runFlags.spawnagent_lastdir = dir
			return protoagent;
		},

		spawnAgentgroup: function(troopid,tilepos,team,delta,amount,dir,stance,flag){
			// temp
			troopid = trpid.convert(troopid);
			let pos = tilepos
			let agentslist = [];
			for (let i = 0; i < amount; i++){ // this one is too slow 
				agentslist[i] = this.spawnAgent(troopid,pos,team,dir,stance,flag);
				for (let p = 0; p < 2; p++){pos[p] += delta[p];}; // add delta
			};
			let expected_agentgroup = new RTSagentGroup(agentslist,team);
			return expected_agentgroup;
		},

		spawnStatic: function(staticID,tilepos,team){
			Cmd.Qset(this.CmdType,"spnSt",`${staticID},${tilepos[0]},${tilepos[1]},${team}`);
			let protostatic = new DISagent(DIS.agent.searchEmptySpace(),staticID,team,false);
			return protostatic;
			
		},

		/**
		 * spawnpalisade.
		 *
		 * @param {} tileposbeg
		 * @param {} tileposend
		 * @param {} team
		 */
		spawnPalisade: function(tileposbeg,tileposend,team){ // returns DISagent
			Cmd.Qset(this.CmdType,"spawnPalisade",`${tileposbeg[0]},${tileposbeg[1]},${tileposend[0]},${tileposend[1]},${team}`);
			let protostatic = new DISagent(DIS.agent.searchEmptySpace(),staid["STA_palisade"],team,false);
			return protostatic;
		},

		/**
		 * .
		 *
		 * @param {} tileposbeg
		 * @param {} tileposend
		 * @param {} team
		 */
		spawnWall: function(tileposbeg,tileposend,team){ // returns DISagent
			Cmd.Qset(this.CmdType,"spawnWall",`${tileposbeg[0]},${tileposbeg[1]},${tileposend[0]},${tileposend[1]},${team}`);
			let protostatic = new DISagent(DIS.agent.searchEmptySpace(),staid["STA_wall"],team,false);
			return protostatic;
		},

		/**
		 * just let the DIS generate height map 
		 */
		generateHeightmap: function(){ // generate heightmap
			Cmd.Qset(this.CmdType,"genHeightmap",""); // just do it
		},


	},

	//Cmd.sys
	sys: {
		CmdType: CTYP_SYS, 
	
		exec: function(jsfile) { // execute js file
			Cmd.Qset(this.CmdType,"exec",`${jsfile}`);
		},

		eval: function(jsSentence) { // eval(jsSentence) on the DISCmd interpreter. might be dangerous 
			Cmd.Qset(this.CmdType,"eval",`${jsSentence}`);
		},

		/**
		 * automatically import game data written in json format.
		 * if you want to import mission local data, then try using 
		 * -> MISSION.local.importData() 
		 * @method importData
		 * @param {string} path Root directory is the game directory. Also you need not to write .json.txt
		 */
		importData: function(path){
			const lastDotIndex = path.lastIndexOf('.');
			if (lastDotIndex !== -1) {
				let extension = path.slice(lastDotIndex + 1);
				if (extension != "json"){
					errorlog(`Cmd.sys.importData(${path}) loads only json/json.txt file. Also you need not to put extension`)

				}
			} else {
				path += ".json"

			}

			Cmd.Qset(this.CmdType,"importDISDjson",`${path}`);
		},


		/**
		 * danger. never use this cmd unless you're aware of DIS RM string memory allocation
		 *
		 * @param {string} path Starts from game directory.
		 * @param {RM_ADRT} Adrt 
		 */
		loadtext: function(path,Adrt){
			Cmd.Qset(this.CmdType,"loadtxt",`${path},${Adrt}`);
		},
	
	},

	// -------------
	// Cmd.mission 
	// -------------
	mission: {
		CmdType: CTYP_MISSION,
		
		/**
		 * 
		 *
		 * @param {playerid} pid Currently meaningless.
		 */
		victory:  function(pid){
			Cmd.Qset(this.CmdType,"endGame",`1`);
		},

		/**
		 * 
		 *
		 * @param {playerid} pid Currently meaningless.
		 */	
		defeat:  function(pid){
			Cmd.Qset(this.CmdType,"endGame",`2`);
		},

		/**
		 * Turn on mission end flag.
		 *
		 * @param {number} consequence Mission result for player. 1 = victory, 2 = defeat
		 */
		endMission: function(consequence) { 
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

		ckIntegrity: function(Dagt){
			Cmd.Qset(this.CmdType,"agtCert",`${Dagt.getid()}`); // unco

		},
		
		setName: function(agentAdr,name){
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
			let convt = DATA.TECH.ptrs[[techid.convert(tech)]].getFlagAddress();
			Cmd.Qset(this.CmdType,"giveTech",`${playerid},${convt[0]},${convt[1]}`);
		},

	},


	
	// -------------
	// Cmd.group
	// -------------

	group: { 
		CmdType: CTYP_GROUP,
		cgrp: [], // agentid array
		Adr_cgrp_list_head: getv(1212),

		// @param {RTSagentGroup} grp You can hand agentid array as well.
		setCgrp: function(grp){
			let agentlist = "";
			if (Array.isArray(grp)){
				for (let elm of grp) {
					agentlist += elm + "|";
				};
			} else { 
				for (let elm of grp.getids()) {
					agentlist += elm + "|";
				};
			};
			deblog(agentlist)
			Cmd.Qset(this.CmdType,"setCgrp",agentlist);
			this.cgrp = grp;
		},

		checkCurrentGroup: function(grp){
			if(grp != this.cgrp){this.setCgrp(grp);};
		},

		registerCohort: function(grp,player,cohortid) {
			this.checkCurrentGroup(grp);
			// temporary only for player
			if (player == 0){
				Cmd.Qset(this.CmdType,"registerCohort",`${player},${cohortid},${this.Adr_cgrp_list_head},${grp.idlist.length}`);
			};
			return new DIS_cohort(player,cohortid,grp.idlist);
		},

		move: function(grp,path,flag){
			flag = flag || 0;
			this.checkCurrentGroup(grp);
			let goal = path; // kari
			Cmd.Qset(this.CmdType,"move",`${goal[0]},${goal[1]},${flag}`);
		},

		attack: function(grp,targetid){
			this.checkCurrentGroup(grp);
			Cmd.Qset(this.CmdType,"attack",`${targetid}`);
		},

		setStance: function(grp,stanceid,flag){
			flag = flag || 0;
			this.checkCurrentGroup(grp);
			Cmd.Qset(this.CmdType,"setStance",`${stanceid}`);
		},

	},


		// -------------
		// Cmd.ui
		// -------------

		//radio dialog
		//
		ui: { 
			CmdType: CTYP_UI,
			
			sendSimpleDialog: function(txt,time,face){
				let log = new DIS_dialog(txt,time,face);
				pushDialogQueue(log);
			},

			pushDialogQueue: function(dlog){ // push arg to dialog queue and toggle dialog manager switch
				// set up string
				
				let sendstring = (DIS.string.convertString(dlog.string) + "," + dlog.showframe + "," + make_Array_DIStable(dlog.icon) + "," + make_Array_DIStable(dlog.size) + "," + make_Array_DIStable(dlog.opensound) + ";");

				Cmd.Qset(this.CmdType,"pushDialogQueue",sendstring);
				RTS.DlogManager.afterEffects.push(dlog.afterEffect);
				deblog(sendstring)
			},

			forceSkipDialog: function(skipi){ // toggle break flag switch
				Cmd.Qset(this.CmdType,"forceSkipDialog",skipi);
				// still triggers afterEffect()
				
			},

			clearDialogQueue: function(){ // init dialog queue and force break - clear event switch on
				RTS.DlogManager.afterEffects = []; // unlike forceSkip, thus will nullfy dialog afterEffect.
				Cmd.Qset(this.CmdType,"clearDialogQueue","");

			},

			getPictureInfo: function(picid){
				let rei = Cmd.ReturnQueue.length // return index
				Cmd.Qset(this.CmdType,"getPictureInfo",`${picid},${rei}`);
				let retLink = new CmdRetLink(RMarray)
				return retLink;
			},
		

	},



};

// ----------------------------------
// DIS Player UI system
// ----------------------------------

// DUI init process is run after disrc.js in user directory.

var DUI = DUI || {};

DUI = {
	init(){

	},

	setUserCursor(file){
		let userpath = "../user/userui/" + file;
		this.cursor_picture = userpath;
		
	},


	cursor_picture: "map_pointer",

};



// init load
if (!VIRTUAL_ENV){
	DIS.init.loadBootconf();
	DIS.data.init(); // reset DIS data
	DIS.init.initID();
	Cmd.init();
}


const techtest = `
{
	"TECH": {
		"dra_siege": {
			"id": "dra_siege",
			"techflagslot": [1,"0x1"]
		},
		"dra_naskarl": {
			"id": "dra_naskarl",
			"techflagslot": [1,"0x2"]
		},
		"dra_inf1": {
			"id": "dra_inf1",
			"techflagslot": [1,"0x4"]
		},
		"dra_inf2": {
			"id": "dra_inf2",
			"techflagslot": [1,"0x8"]
		},
		"dra_inf3": {
			"id": "dra_inf3",
			"techflagslot": [1,"0x10"]
		},
		"dra_tool_upgrade": {
			"id": "dra_tool_upgrade",
			"techflagslot": [1,"0x20"]
		},
		"dra_crossbow_improvement": {
			"id": "dra_crossbow_improvement",
			"techflagslot": [1,"0x80"]
		},
		"dra_dragonforge": {
			"id": "dra_dragonforge",
			"techflagslot": [1,"0x100"]
		},
		"dra_squires": {
			"id": "dra_squires",
			"techflagslot": [1,"0x200"]
		},
		"dra_better_armor": {
			"id": "dra_better_armor",
			"techflagslot": [1,"0x400"]
		},
		"dra_empyrean_guard": {
			"id": "dra_empyrean_guard",
			"techflagslot": [1,"0x800"]
		},
		"dra_shooting_training": {
			"id": "dra_shooting_training",
			"techflagslot": [1,"0x1000"]
		},
		"dra_combat_training": {
			"id": "dra_combat_training",
			"techflagslot": [1,"0x2000"]
		},
		"dra_naskarl_gyao": {
			"id": "dra_naskarl_gyao",
			"techflagslot": [1,"0x4000"]
		},
		"food1": {
			"id": "food1",
			"techflagslot": [2,"0x1"]
		},
		"food2": {
			"id": "food2",
			"techflagslot": [2,"0x2"]
		},
		"wood1": {
			"id": "wood1",
			"techflagslot": [2,"0x4"]
		},
		"wood2": {
			"id": "wood2",
			"techflagslot": [2,"0x8"]
		},
		"cart1": {
			"id": "cart1",
			"techflagslot": [2,"0x10"]
		},
		"cart2": {
			"id": "cart2",
			"techflagslot": [2,"0x20"]
		},
		"crane": {
			"id": "crane",
			"techflagslot": [2,"0x40"]
		},
		"melee1": {
			"id": "melee1",
			"techflagslot": [2,"0x80"]
		},
		"melee2": {
			"id": "melee2",
			"techflagslot": [2,"0x100"]
		},
		"arrow1": {
			"id": "arrow1",
			"techflagslot": [2,"0x200"]
		},
		"arrow2": {
			"id": "arrow2",
			"techflagslot": [2,"0x400"]
		},
		"armor1": {
			"id": "armor1",
			"techflagslot": [2,"0x800"]
		},
		"armor2": {
			"id": "armor2",
			"techflagslot": [2,"0x1000"]
		},
		"AP": {
			"id": "AP",
			"techflagslot": [2,"0x2000"]
		},
		"HPSP": {
			"id": "HPSP",
			"techflagslot": [2,"0x4000"]
		},
		"ballistics": {
			"id": "ballistics",
			"techflagslot": [2,"0x8000"]
		},
		"siege_engineer": {
			"id": "siege_engineer",
			"techflagslot": [2,"0x10000"]
		},
		"dralchemy": {
			"id": "dralchemy",
			"techflagslot": [2,"0x20000"]
		},
		"artitecture": {
			"id": "artitecture",
			"techflagslot": [2,"0x40000"]
		},
		"husbandry": {
			"id": "husbandry",
			"techflagslot": [2,"0x80000"]
		},
		"townwatch": {
			"id": "townwatch",
			"techflagslot": [2,"0x1000000"]
		},
		"arcane_transmission": {
			"id": "arcane_transmission",
			"techflagslot": [2,"0x2000000"]
		},
		"field_medic": {
			"id": "field_medic",
			"techflagslot": [2,"0x4000000"]
		},
		"conscription": {
			"id": "conscription",
			"techflagslot": [2,"0x8000000"]
		},
		"castle_age": {
			"id": "castle_age",
			"techflagslot": [2,"0x10000000"]
		},
		"imperial_age": {
			"id": "imperial_age",
			"techflagslot": [2,"0x20000000"]
		},
		"dra_add_magic_missile": {
			"id": "dra_add_magic_missile",
			"techflagslot": [3,"0x1"]
		},
		"dra_dravalry": {
			"id": "dra_dravalry",
			"techflagslot": [3,"0x2"]
		},
		"dra_drachemistry": {
			"id": "dra_drachemistry",
			"techflagslot": [3,"0x4"]
		},
		"dra_basement": {
			"id": "dra_basement",
			"techflagslot": [3,"0x8"]
		},
		"imp_comitatenses": {
			"id": "imp_comitatenses",
			"techflagslot": [3,"0x1"]
		},
		"imp_cataphract": {
			"id": "imp_cataphract",
			"techflagslot": [3,"0x2"]
		},
		"imp_siegeweapons": {
			"id": "imp_siegeweapons",
			"techflagslot": [3,"0x4"]
		},
		"imp_composite_armor": {
			"id": "imp_composite_armor",
			"techflagslot": [3,"0x8"]
		},
		"imp_vibroweapon": {
			"id": "imp_vibroweapon",
			"techflagslot": [3,"0x10"]
		},
		"imp_loricananos": {
			"id": "imp_loricananos",
			"techflagslot": [3,"0x20"]
		},
		"imp_AntiRealityWarping": {
			"id": "imp_AntiRealityWarping",
			"techflagslot": [3,"0x40"]
		},
		"imp_decadencepart1": {
			"id": "imp_decadencepart1",
			"techflagslot": [3,"0x80"]
		},
		"imp_decadencepart2": {
			"id": "imp_decadencepart2",
			"techflagslot": [3,"0x100"]
		},
		"imp_elastic_defence": {
			"id": "imp_elastic_defence",
			"techflagslot": [3,"0x200"]
		},
		"poteton_anarchy": {
			"id": "poteton_anarchy",
			"techflagslot": [3,"0x1"]
		},
		"poteton_perfusion": {
			"id": "poteton_perfusion",
			"techflagslot": [3,"0x2"]
		},
		"rurik_covenmeeting": {
			"id": "rurik_covenmeeting",
			"techflagslot": [3,"0x1"]
		},
		"rurik_druzina": {
			"id": "rurik_druzina",
			"techflagslot": [3,"0x2"]
		},
		"rurik_age3": {
			"id": "rurik_age3",
			"techflagslot": [3,"0x4"]
		},
		"sushi_tengger_cavalry": {
			"id": "sushi_tengger_cavalry",
			"techflagslot": [3,"0x1"]
		},
		"sushi_kamikaze": {
			"id": "sushi_kamikaze",
			"techflagslot": [3,"0x2"]
		},
		"sushi_chemistry": {
			"id": "sushi_chemistry",
			"techflagslot": [3,"0x4"]
		}
	}
}
`

// without RPG_RT.exe
if (VIRTUAL_ENV){
const roottroop = `
{
	"TROOP": {
		"dra_ancestor_ragonass": {
			"name": "Ragonass",
			"size": [20,22],
			"race": "RACE_dragon",
			"faction": "FAC_dra",

			"SP": 10000,

			"personality": "brutal",
			"color": "blue"

		}

	}
}
`

const sampletrp = `
{
	"TROOP": {

		"imperial_legion_banner": {
			"name": "Imperial Legion Signifer",
			"agentType": 1,
			"size": [10,12],
			"agentSprite": 68,
			"race": "RACE_human",
			"faction": "FAC_legion",

			"Lv": 21,
			"unitclass": 3,
			"HP": 1400,
			"HPreg": 5,
			"SP": 2500,
			"SPreg": 5,
			"AD": 50,
			"AP": 50,
			"AR": 180,
			"MR": 195,
			"HIT": 20,
			"WILL": 92,
			"EVA": 10,
			"Crit": 0,
			"MoveSpeed": -5,

			"AAtype": 4,
			"AAframe": 1,
			"AArangeMax": 80000,
			"AArangeMin": 60000,
			"AAfunction": 1267,
			"AS": 45,

			"ActiveSkill": [1232,1248,0,0],
			"PassiveSkill": 1231
		},

		"dra_hero_orthunass": {
			"name": "Orthunass the Empyrean Lord",
			"agentType": 1,
			"size": [10,12],
			"agentSprite": 71,
			"race": "RACE_dragon",
			"faction": "FAC_dra",

			"Lv": 30,
			"unitclass": 3,
			"HP": 1800,
			"SP": 4500,
			"AD": 5,
			"AP": 185,
			"MR": 100,
			"HIT": 0,
			"EVA": 0,
			"WILL": 100,
			"Crit": 0,
			"MS": 90,

			"AAType": 4,
			"AAfunction": 1267,
			"AS": 45,
			"AArangeMax": 140000,
			"AAframe": 1,

			"motionFlags": [2,10],

			"ActiveSkill": [1229,1293,1232,1210],
			"PassiveSkill": 1231,

			"objFlags": [15,23],
			"Perks": [
				[0,12]

			]

		}

	}
}
`

const inheritancetest = `
{
"TROOP": {
	"visuna": {
		"INHERITS": "dra_hero_orthunass"

	}

}
}
`
	facid.FAC_dra = 114514;
	raceid.RACE_dragon = 4545;
	DATA.parseDISjson(roottroop)
	DATA.parseDISjson(sampletrp)
	deblog("\n\n\n")
	DATA.TROOP.convertIntoCsvLine(DATA.TROOP.dra_hero_orthunass);
	deblog("\n\n\n")
	DATA.autoregister(DATA.parseDISjson(inheritancetest))

	/*
	Cmd.sys.importData("test.json")
	RTS.mission.setPlayer(9,1)
	let cohort1 = Cmd.map.spawnAgentgroup("TRP_imperial_comitatenses_menavlion",[27,32],0,[0,-2],8);
	Cmd.group.registerCohort(cohort1,0,1);
	Cmd.map.spawnAgent("TRP_imperial_comitatenses_menavlion",[27,32],0,[0,-2],8);
	deblog(Cmd.CmdQueue)
	Cmd.group.move(cohort1,[1,1],0);
	Cmd.run();

	RTS.mission.local.trites = RTS.mission.createSimpleTrigger_Loop(90);
	deblog(JSON.stringify(RTS.mission))
	let ply= new DIS_RTSplayer(0,1)
	*/
const maptest = `
{
	"name": "poteton_trainingmap",
	"mapscript": [],
	"dataextension": [],
	"dependency": [],

	"terrainfile": "tilegen.txt",
	"tileset": 13,
	"size": [102,55],
	"heightgen": "HGEN_PRESET"

}
`


	/*
	let fucker = Cmd.game.pic.load("camera_ball",10);
	fucker.refreshPicInfo();
	Cmd.run()
	Cmd.sendback([11,4,5,14],0,RMarray)
	fucker.refreshPicInfo();
	RTS.path.init();
	RTS.path.storePath(1,[1414,4545,1919])
	RTS.path.givePath(1)
	RTS.path.copyPath(1,2)
	DIS.log.crash("test")
	
	DIS.data.init(); // reset DIS data
	*/

};


// mission script for poteton training
//
//

