/**
 * @copyright TokyoHuskarl
 * @license ?
 * 
 * ~ DIS API ~
 * 
 * This js file must be loaded whenever DIS game system reboots.
 * Thanks to 2003MP's spec, loading other modules on js is kinda stressful,
 * so this module contains a lot of important and complicated js objects.
 */


/**
 * for TPC memory allocation
 * kari consts... will be moved to other files.
 * @namespace 
 */
const TPCadr = {
	t: {
		Str_playergamedata_0: 767,
		Str_LanguagePath: 528,
	},
	v: {
		Adr_MapElevationArray: 572947, // define_structures_map.tpc
		Adr_Mission_Agent_TeamSize_Limit: 1080,
	}
};

// if setv() is undefined, it's virtual enviroment on node.js, qjs or sth.
const VIRTUAL_ENV = (typeof setv == "undefined") ? true : false;


// these lines are written in order not to cause error when you test this file on Node.js
var setv = setv || function(){};
var getv = getv || function(n){return n};
var sett = sett || function(){};
var gett = gett || function(t){return `string t[${t}]`};
var sets = sets || function(){};
var gets = gets || function(){return true};

/**
 * setva
 * Set variable array.
 * @param {int} address - TPC var address
 * @param {array} jsarray - int array
 */
function setva(address,jsarray){setv(address,jsarray);};




//0 = normal mode, 2 = debug mode, 1 = developer mode
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


/**
 * Log function for debugging the game. 
 * With 2003MP binary this copies the same string to the gamelog.
 * Overridden by nothing if the game mode is BOOT_MODE_DEBUG
 *
 * @param {string} text
 */
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
	if (DEBUG != BOOT_MODE_DEBUG){let contx = "JS ERROR:" + text;console.log(contx);} else {deblog(`JS ERROR: ${text}`)};
	return Cmd.game.log_error(text);
};

/**
 * save target object to given TPC string slot as a json.
 * @param {*} obj
 * @param {int} strslot - TPC string var slot.
 */
function save_jsobj_as_JSON(obj,strslot){
	sett(strslot,JSON.stringify(obj));
};




const LF = "\n";

// RM var types
const RMvar = 1,
	RMswitch = 2,
	RMstring = 3,
	RMpicture = 4,
	RMarray = 5;

// this is not necessarily. kek
function getRM(typ,add){
	if (typ == RMvar) {
		return getv(add)
	} else if (typ == RMswitch) {
		return gets(add)
	} else if (typ = RMstring) {
		return gett(add)
	};
};


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
//
/**
 * @class DATA_entity
 * This class is the root templete for the entire DATA_* object class.
 * Used as elements of game Database. 
 */
class DATA_entity {
	constructor(id){this.id=id;};
	i = -1; // set in DATA.{datatype}.register()

	/**
	 * getElmAsString
	 *
	 * convert DATA_entity properties into a string 
	 * In this method, arrays can be disassembled. 
	 * e.g. ActiveSkill array for TROOP data [1201,0,0,0] will be like
	 * "ActiveSkill:0,ActiveSkill:1,ActiveSkill:2,ActiveSkill:3,"
	 * "1201,0,0,0"
	 *
	 * shit explanation
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

	ezConvWord(wd,wdlist){return wdlist[wd];};

};


const TREETYPE_TEMPLATE = 0,
	TREETYPE_TRP = 1,
	TREETYPE_TECH = 2;

/**
 * DATA_tree.
 * This class deals with tree type structures like tech tree or troop tree for a faction.
 * @extends {DATA_entity}
 */
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


/**
 * DATA_faction.
 * Template class for factions.
 * 
 * @extends {DATA_entity}
 */
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



// 

/**
 * DATA_troop.
 * template class for troops
 * @extends {DATA_entity}
 */
class DATA_troop extends DATA_entity {
	constructor(id,src){
		super(id);
		// inherit DATA_troop object
		DATA.makeDataInherit(this,"TROOP",src);
		// copy given troop template
		DATA.giveSrcParamToData(this,src);

		//what the fugg is this naming?
		const pewpew = (key,idcon) => {this[key] = typeof this[key] != "number" ? idcon[this[key]] : this[key]};
		// convert strings to DIS number id
		pewpew("faction",facid);
		pewpew("race",raceid);
		

		// convert string skillid into numid
		if (this.hasOwnProperty("ActiveSkill")){ 
			for (let i; i < this.ActiveSkill.length; i++){
				this.ActiveSkill[i] = sklid.convert(this.ActiveSkill[i]);
			};
		} else {
			this.ActiveSkill = [0,0,0,0]
		};

	};

};

// is this really necessarily?
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
// とりあえず人類だけ対応，racekeyの処理については，初期化処理との関係で注意が必要か。
class DATA_skin extends DATA_entity {
	constructor(id,src){
		super(id);
		// this.i = index;
		// copy given troop template
		DATA.giveSrcParamToData(this,src);

		// convert race key
		// deblog("Racekey conversion method in DATA_skin is underconstruction. So automatically set it to 0"); // kari
		// this.racekey = 0;
		this.racekey = raceid.convert(this.racekey);
		
		/*
		 * UNDERCONSTRUCTION
		 */
	};

	// default properties
	racekey = 0;
	skinTable = [0];
	headTable = [0];
	haircolorTable = [0];
	hairstyleTable = [0];

 /**
  * sendSkinData.
  *
  * @param {int} adrHead - RPG Maker Variable address
  * @param {int} adrHair - RPG Maker Variable address
  */
	sendSkinData(adrHead,adrHair = -1){

		const pickRndElm = (arr)=>{
			if (arr.length === 0) {
				const erm = 'Skin data Array is empty!';
				deblog(erm);
				throw new Error(erm);
			};
			const randomIndex = Math.floor(Math.random() * arr.length);
			return arr[randomIndex];
		};

		// set head file id
		let filenum = this.racekey * 10000000 + pickRndElm(this.skinTable) * 1000000 + pickRndElm(this.haircolorTable) * 10000 + pickRndElm(this.headTable);
		setv(adrHead,filenum);

		// set hair id
		// kari. how should I solve this terrible hair sprite system?
		if (adrHair > 0) {
			setv(adrHair,pickRndElm(this.hairstyleTable));
		};
		// UNDERCONSTRUCTION
		deblog(`skinkey: ${filenum}`);
		return filenum; 
	};

};

/**
 * underconstruction
 * Data class for building units.
 * @class DATA_static_unit
 */
class DATA_static_unit extends DATA_entity { // building?
	constructor(id,src){
		super(id);
		// inherit DATA_troop object
		DATA.makeDataInherit(this,"STATIC_UNIT",src);
		// copy given static template
		DATA.giveSrcParamToData(this,src);

	};

};


class DATA_skill extends DATA_entity {
	constructor(id,src){
		super(id);
		// inherit DATA_skill object
		DATA.makeDataInherit(this,"SKILL",src);
		// copy given skill temp
		DATA.giveSrcParamToData(this,src);

		// if there's no data type setting but cev setting in given data, consider this skill as a preset one
		if(typeof this.datatype === "undefined"){
			if(this.cev > 0){
				this.datatype = "preset";
				
			} else {
				// otherwise treat it as custom type
				this.datatype = "custom";

			};
		};

		// convert datatype into int
		this.datatype = this.ezConvWord(this.datatype,{'custom':0, 'enhanced':1,'preset':2});
		if(this.datatype == 2){ // preset type
			// override 
			this.getCallID = function(){return this.cev}; // just return cev id. Do nothing else.
			// this.setCallID = function(i){return 0};
			this.isPreset = ()=>{true;};
		};

	};

	/**
	 * #CallID is extra id for skill data.
	 * @property
	 */
	#CallID = 0;

	setCallID(i){
		return this.#CallID = i;
	};

	getCallID(){
		// underconstruction, need to make entire design
		return this.#CallID;
	};

	isPreset(){return false;};


};


/**
 * DATA_tech.
 *
 * @extends {DATA_entity}
 */
class DATA_tech extends DATA_entity {
	constructor(id,src){
		super(id);
		// inherit DATA_tech object
		DATA.makeDataInherit(this,"TECH",src);
		// copy given template to obj
		DATA.giveSrcParamToData(this,src);

		if(this.type == "preset"){
			
		}
		
		// if not
		this.is_researchable = true;
	};

  /**
   * #ckIfPreset.
	 * @return {bool} - if this tech is preset type tech, return true 
   */
	#ckIfPreset(){return (this.type == "preset");}


 /**
  * getCost.
	* OVERRIDE ME if you want any extra cost calculation.
	* @param {int} teamid - check player one default
	* @return {array} [food,wood,stone,gold,speed]
  */
	getCost(teamid = 0){
		if(typeof this.cost == "undefined"){
			return [0,0,0,0,0];
		};
		return this.cost;
	};

 /**
  * getFlagSlot.
	* @return {[int,hex]} - [TechBitsAddress,Flag] 
  */
	getFlagSlot(){
		// [address,flag]
		// let retme = [this.techflagslot[0],parseInt(this.techflagslot[1],16)];
		// return retme;
		return [this.techflagslot[0],this.techflagslot[1]];
	};

	/**
	 * UNDERCONSTRUCTION...
	 * Called after simple cost condition.
	 * Override me, but let me always return bool.
	 * @return {bool} - returns true if it's possible to research.
	 */
	Extra_Condition(){return this.is_researchable;};

	/**
	* UNDERCONSTRUCTION.
  * Override me!.
	* Called whenever research of the tech completed.
  */
	EV_OnCompletion(){};

};

// ------------------------------------------------
// DIS objects
// ------------------------------------------------

// DISentities on js system are not real parameters of DIS agents in the game. 
// It's rather something like a bundle of links to actual entities on RPGMaker.
// so unless you refresh its information through functions, data in DIS_entity can be diffrent from the actual value stored in RPGMaker. 

class DIS_entity { // prototype for DIS RPGmaker Object
	constructor(){
		this.class = "DIS_entity";
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
			deblog(`DIS_entity: received ${stuff}`);
		} else { // got null
			errorlog("DIS_entity: Receiving return value from DIS command process on TPC failed.");
		};
		this.isAwaitingReturn = false;
	};

	getWhereToStorage(gtwut){ // override me, but beware, this function must always return int index for receivedStorage array.
		return "undefined";
	}

	getClass(){return this.class;};



}

class DIS_RMpicture extends DIS_entity { // simple picture object.
	constructor(pid,file,pos){
		super();
		this.class = "DIS_RMpicture";
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
	};

	kill(){
		Cmd.game.pic.remove(this.pid);
		this.activated = false;
	};

};

/**
 * This class is used for generating modified version of database unit
 * for particular situations.
 *
 * @class DIS_unit
 * @extends {DIS_entity}
 */
class DIS_unit extends DIS_entity {
	constructor(unitid,type){
		super();
		this.type = type || 0; // static or land? unco 
		if (type === 11){deblog("static data base system is still underconstruction")};
		this.unitid = unitid;
		
		// load parameters from the database

	};

	
 /**
  * placeAt.
  *
  * @param {[int,int]} pos
  * @param {} team
  * @param {} dir
  * @param {} stance
  * @param {} flag
	* @return {DIS_agent}
  */
	placeAt(pos,team,dir,stance,flag){
		

	};
	
};

/**
 * DIS_agent.
 * 
 * @extends {DIS_entity}
 */
class DIS_agent extends DIS_entity { // agents for RTS mode 
	constructor(agentid,unitid,team,isCertified){ // params around certified shits should be changed into Promise 
		super();
		this.agentid = agentid; // if agent id is secured, then no problemo.
		this.class = "DIS_agent";
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
		 /**
			* horrible.
			*
		* @param {int} slot
  */
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

	// #############
	// Event triggers
	// #############
	
	// Called from TPC in some circumstances (if only flag is set for the agent).
	// Override them to use


	/**
	 * Triggered when the agent killed.
	 */
	EV_OnDeath(){};

	EV_OnEscape(){};

 /**
  * This will be triggered if the agent takes damages.
	* @param {int} dmg - damage amount
  */
	EV_OnDamage(dmg){};

	EV_OnKilling(){};

	EV_OnSpawn(){};

};

class DIS_agent_static extends DIS_agent {
	constructor(agentid,buildingid,team,isCertified){
		super(agentid,buildingid,team,isCertified);
	};
	
};

class RTSagentGroup { // list object for DIS_agent.
	constructor(agtArray,team){
		this.idlist = [];

		// this design can make terrible error in future? idk 
		if (typeof agtArray[0] == "object"){ // if DIS_agent is set in agtArray
			this.agentlist = agtArray; // save agentlist
			for (let elm of agtArray){
				this.idlist.push(elm.getid()); // save agentid
			}; 
			
		} else { // otherwise, just make only idlist
			this.agentlist = "undefined";
			this.idlist = agtArray;
		};
		
		this.team = team || "undefined";
	};

	info = {
		Schewerpunkt: [0,0],
	};

	pushAgent(agt){
		this.agentlist.push(agt);
	};

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

function isNumeric(str){return /^\d+$/.test(str);};





/**
 * DIS object is an API for accessing fundamental data of DIS.
 * Whenever you want to access DIS game data, this object gives you ways to get/set the data..
 * @namespace DIS
 */
var DIS = DIS || {};

const Adrt_ShLog = 782; // same as Shell Log address 

/**
 * @class IDdict
 * 
 * ID dictionary
 *
 */
class IDdict {
 /**
  * constructor.
  *
  * @param {string} prefix - like "TRP", "FAC" or etc. It doesn't need "_"
  */
	constructor(prefix){this.prefix = prefix + "_";}
	reserved = new Set(["prefix","reserved","convert","register"]); // never change

	/**
	 * convert given key to int.
	 *
	 * @method convert
	 * @param {string} given
	 * @return {int} - number id contained in the IDdict.
	 */
	convert(given) {

		// if given string is numeric, simply convert it into int number.
		if (isNumeric(given)){
			return parseInt(given);
		};


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

 /**
  * register key and value.
  * 
  * @param {string} key - need prefix that fits to one of the IDdict.
  * @param {int} val - value.
	* @return {int} - this[key] = val;
  */
	register(key,val){
		if (isNumeric(key)){ // you cannot use numeric key, since (thanks to old design) DIS system treats them as common event id
			return errorlog(`You cannot use a pure numeric key like "${key}" in DIS ID dictionary.`);
		
		} else if (this.reserved.has(key)){ // if given key is already registered, return error
			return errorlog(`The name of the new key "${key}" is reserved word for DIS ID dictionary!`);
		};

		// if given key has no prefix, return error
		if (key.lastIndexOf(this.prefix) == -1){
			return errorlog(`"${key}" has no "${this.prefix}" prefix.`);
		};

		// if there's no happening, just register key and value
		return this[key] = val;
	};

};


// should they be put under a namespace dictionary?
var trpid = new IDdict("TRP"); // troop ID table
var staid = new IDdict("STA"); // building ID table
var facid = new IDdict("FAC"); // faction ID table
var raceid = new IDdict("RACE"); // race ID table
var techid =  new IDdict("TECH"); // ["techid",[group,flagbit]]
var sklid = new IDdict("SKL"); // skill ID table
var skinid = new IDdict("SKIN"); // skill ID table

// consts
/**
 * might be changed later. 
 * @namespace DIS.consts
 */
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
* DIS API object
* This big object has methods to access RPG Maker system, DIS data system and etc directly via js.
* Plenty of useful methods are there but they don't care overheads very much, so they might be slow.
* Also be careful of difference of execution timing between DIS API and methods called via Cmd. 
*
* @namespace DIS
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
					};
				} else { // load amount is below 0
					text += `loading process t[${type}] seemingly failed. Check integrity of const_*.txt files.`
					errorlog(text);
				};
				return DIS.log.push(text)
			};
			// --------------------
			// load race ID
			// --------------------

			// ->DIS.data.RACE.init()
			
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
			// kari. this will be obsolete.
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
			for (let i = 1; i < DATA.TECH.ptrs.length; i++){
				techid.register(techid.prefix + (DATA.TECH.ptrs[i].id),i);

			};


			// --------------------
			// load skill ID
			// --------------------
			//
			sklid = new IDdict("SKL"); // init
			for (let i = 1; i < DATA.SKILL.ptrs.length; i++){
				sklid.register(sklid.prefix + (DATA.SKILL.ptrs[i].id),i);

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


/**
 * Components for DIS module system.
 * @namespace
 */
DIS.modules = (function(){
	let currentMod;

	if(typeof boot_config == "undefined"){
		deblog("DIS.modules: boot config for getting current module name is missing.\nMaybe DIS API is running on virtual environment, so it's gonna generate dummy module name.");
		currentMod = "dummymod";
	} else {
		currentMod =  boot_config.module
	};

	return {
		getCurrentModuleDataPath(){return ("../Modules/" + currentMod + "/Data/");},

	};

})();

/**
 * Useful macros for DIS API.
 * @namespace
 */
DIS.macro = {
	timeToFrame: (h,m,s) => ((h * 3600 + m * 60 + s) * DIS.RTSFPS), 
	/**
	 * Convert 2dim array to 1dim array.
	 *
	 * @param {object} twoDimensionalArray
	 * @return {array}
	 */
	flattenArray: function(twoDimensionalArray){
		const flattenedArray = [];
		for (let row of twoDimensionalArray){
			// Array.prototype.push.apply
			Array.prototype.push.apply(flattenedArray, row);
		}

		return flattenedArray;
	},

};


/**
 *
 * Name space for functions for static unit aka buildings.
 * @namespace 
 */
DIS.building = {

 /**
  * getBuildCost.
  * unco
  * @param {STAid} staid
	* @return {[food,wood,stone,gold,time]} - each elm is {int} type.
  */
	getBuildCost(staid){
		

	},

	getTroopInSlot: function(slot){

		return -1;
	},

	/**
	 * Overwrite slot troop data.
	 * unco
	 * @param {TRPid} trpid
	 * @param {int} slot
	 */
	setTroopToSlot: function(trpid,slot){

	},

	/**
	 *  for human mil buildings like barrack and stable.
	 *  unco
	 * @param {} agtid
	 * @param {} upslot
	 */
	upgradeBuilding: function(agtid,upslot){
		
	},
	
};


/**
 * Components for DIS log system.
 * @namespace
 */
DIS.log = {
	
	/**
	 * Forcibly crash the game.
	 * @param {string} error
	 */
	crash: function(error){
		const day = new Date();
		const file = "user/log/crashlog_" + day.getFullYear() + "_" + day.getMonth() + "_" + day.getDate() + "_" + day.getHours() + "_" + day.getMinutes()
		DIS.log.push(error);
		Cmd.game.exportText(Adrt_ShLog,file);
		Cmd.game.pic.load(error,999); // force crash
		deblog(file);
	},


	/**
	 * Push new string to the log.
	 *
	 * @param {string} txt
	 */
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


/**
 * Components for DIS language system.
 * UNDERCONSTRUCTION, but ik I have to do this. dang
 * @namespace
 */
DIS.lang = {
	init: function(){ // this function called whenever player changes game language...
		// unco
	},

	currentLangsuffix: gett(TPCadr.t.Str_LanguagePath), // "_jp", "_en" or whatever

	// ??? is there any necessity of not using Object but array? 
	currentFontdata: {
		common: [gett(Adrt_FontCommon),getv(Adr_FontCommonSize)],
		ui: [gett(Adrt_FontUI),getv(Adr_FontUISize)],
		imperial: [],

	},

	getPropertyWithLangsuffix: function(obj,key){
		const keyWithSuf = key + this.currentLangsuffix;
		let res;
		if (keyWithSuf in obj){
				res = obj[keyWithSuf];
		} else {
			if (key in obj) {
				res = obj[key];
			} else {
				errorlog(`Couldn't find any language property corresponding with given key: ${key}`);
				res = 0;
			};
		};
		return res;
	},

};

DIS.conf = {
	// resolution
	resolution: [getv(adr_RMresolutionX),getv(adr_RMresolutionY)],

};

/**
 * DIS functions for dealing with string.
 * If you're translator or sth, check DIS.lang as well
 * @namespace 
 */
DIS.string = (function(){
	const tags = [
		// color tags
		["<white>","\\c[0]"],
		["<yellow>","\\c[14]"],
		["<ltgreen>","\\c[1]"],
		["<green>","\\c[2]"],
		["<ltred>","\\c[5]"],
		["<red>","\\c[17]"],
		["<purple>","\\c[16]"],
		["<ltpurple>","\\c[7]"],
		["<ltblue>","\\c[10]"],
		["<blue>","\\c[11]"],
		["<glay>","\\c[4]"],
		
		// parameter tags
		["<HP>","\\c[12]HP\\c[0]"],
		["<AD>","\\c[17]AD\\c[0]"],
		["<AP>","\\c[16]AP\\c[0]"],
		["<AR>","\\c[4]AR\\c[0]"],
		["<MR>","\\c[16]MR\\c[0]"],
		["<HIT>","\\c[5]HIT\\c[0]"],
		["<EVA>","\\c[4]EVA\\c[0]"],
		["<WILL>","\\c[0]WILL\\c[0]"],
		["<MS>","\\c[10]MS\\c[0]"],
	];

	// return given char is CJK or not

	const isJapaneseChar = function(char) {
		const charCode = char.charCodeAt(0);
		return (
			(charCode >= 0x3000 && charCode <= 0x30ff) || // ひらがなとカタカナ Hiragana and Katakana
			(charCode >= 0x4e00 && charCode <= 0x9faf) || // CJK統合漢字 Kanji
			(charCode >= 0xff00 && charCode <= 0xffef)    // フルワイドのASCIIと半角・全角の形 other 2bytes char
		);
	};
	

	return {
		/**
		 * You can add DIS string tag by using this function.
		 * @param {[string,string]} mytag - [0] is tag, [1] is what will be replaced with the tag.
		 */
		addTag:(mytag)=>{tags.push(mytag);},

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

			/**
			 * convert given js string into DIS basic format
			 * @param {string} given
			 * @return {string}
			 */
			convertString: function(given){

				let rs = given;

				// replace color tags
				for (let tg of tags){
					rs = res.replace(tg[0], tg[1]);
				}

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
					const charWidth = isJapaneseChar(char) ? japaneseCharWidth : englishCharWidth;

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
			},


			/**
			 * Convert given text into DIS UI format.
			 * DIS.string.convertString() is also called in this function
			 * UNDERCONSTRUCTION
			 * "{@AD}"
			 *
			 * @param {string} text
			 * @return {string} formatted text
			 */
			formatUIText: function(text){
				let res = this.convertString(text);
				return res;

			},
	};
})();




const Adr_ptr_spawnAgent = 201; //v[201]


/**
 * Components for accessing RTS agents.
 * @namespace DIS.agent
 */
DIS.agent = { 
	// get from game variable
	limit: getv(1004), 
	genPtrPos: 0,

	/**
	 * Search Empty Space function - this function searches a blank space for an agent in the agent data space.
	 * BUT, it has several problems:
	 * 1. It must be very slow.
	 * 2. How can it sync the result after inserting some Cmd.game.wait(n)?
	 * so this needs improvement anyway I suppose....
	*/
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

	/**
	 * A simple getter function that returns DIS_agent.
	 * Toutching RTS.agents directly might be dangerous so maybe you should use this
	 * @param {int} agid
	 * @return {DIS_agent}
	 */
	getAgent: function(agid){
		return RTS.agents[agid];
	},


	// BROKEN
	ck_if_alive(agentid){
		ptr = this.getPtrToMainParam(agentid);
		ptr += 1; // refering to agenttype slot. If *ptr > 0, the agent is seen alive.
		// how about checking unique genid?
		return (getv(ptr) > 0);
	},

	/**
	 * unco.
	 *
	 * @param {} agentid
	 * @param {} name
	 */
	setName: function(agentid,name) {
		
	},

 /**
  * getAgentIDListByTroop_team.
  * unco
  * @param {TRPid} troopid
  * @param {int} team
	* @return {array} - agentid array
  */
	getAgentIDListByTroop_team(troopid,team){
		
	},

 /**
  * getAgentIDListByBuilding_team.
	* Unco
  *
  * @param {} staticid
  * @param {} team
  */
	getAgentIDListByBuilding_team(staticid,team){

	},

};


DIS.map = (function(){
	const Adr_TileInfoHead = 1182;
	const Adr_MapWidth = 2061;
	const Adr_MapHeight = 2062;

	return {
		/**
		 * 
		 * @returns 
		 */
		getTileinfo(){
			return getv(getv(Adr_TileInfoHead),(getv(Adr_MapWidth) * getv(Adr_MapHeight)));
		},

	};

}());


DIS.player = {
	
};

DIS.control = {
	
	
};

class RM_PicCache { // THIS DOESN'T EXTEND DIS_entity.
	constructor(path,key,namespace){
		this.class = "DIS_PicCache";
		this.path = path;
		this.address = "DIS.cache." + namespace + "." + key; // kore mazi?
		this.cachedData = [[],[0,0]]; // [[pixel],[width,height]]
		this.isCertified = false;
	};

	// called back from TPC
	receive(data){
		this.cachedData = data;
		this.isCertified = true; //pseudo promise is fullfiled
	};

	/**
	 *
	 * {int} adrSize - size array is compressed into 24 bit int and written to one address 
	 */
	give(adrData,adrSize){
		setv(adrData,this.cachedData[0]);
		let compress = this.cachedData[1][0] | (this.cachedData[1][1] << 12 ); // up to 4095 * 4095
		setv(adrSize,compress);
	};

	getAdr(){return this.address;}
};

/**
 * DIS.cache
 * Namespace for storing file caches on js system.
 * In this namespace, cache container objects will be dynamically generated.
 * So you shouldn't put any essential elements or whatever here
 * @namespace
 */
DIS.cache = {
	misc: {},

};

/**
 * namespace for function wrappers that called from TPC side.
 * you shouldn't use properties in this namespace unless you're using it in TPC code
 * @namespace DIS._tpc
 */
DIS._tpc = {


	/**
	 * .
	 * @param {DIS_PicCache} cacheobj
	 * @param {array} dataArray - use getv(*,size[0]*size[1])
	 * @param {[int,int]} size - [width,height]
	 */
	send_piccache:(cacheobj,dataArray,size)=>{
		cacheobj.receive([dataArray,size]);
		// deblog(cacheobj.cachedData);
		// deblog(Cmd._Qnext);
	},

	/**
	 * 
	 * 
	 * 
	 */
	take_piccache:(cacheobj,arrayadr,sizeadr)=>{
		cacheobj.give(arrayadr,sizeadr)
	},

	convert_id:(dict,str)=>{
		try {
			return dict.convert(str);
		} catch(error) {
			errorlog(`DIS._tpc.convert_id(${dict},${str}): Something went wrong.\n` + error)
		};
	},


	/**
	 * get js string to regs1 
	 *
	 */
	getString: (str)=>{
		sett(1,str);
	},

	get_skill_CallID:function(strid){
		try {
			/**
			 * ACHTUNG
			 * 現在、移行措置として[cevそのまま,numid,stringid,0]の４つを受け付けて機能する非常に気持ち悪い仕様になっている。
			 * 全てのプリセットスキルのJSON対応が済み次第、組み替えて整理する。
			 * 
			 * Currently, as a temporary measure, it is functioning with a very awkward specification that accepts four parameters: [raw cev,numid,stringid,0].
			 * Once all JSON support for preset skills is complete, it will be reorganized and rearranged.
			 *
			 */
			
			// transition measures. retarded but necessarily
			if(isNumeric(strid)){ // if number is given
				if (strid != 0){
				// try get from SKILL.ptrs[]. if it's not registered just return it back
				const res = (typeof DATA.SKILL.ptrs[strid] == 'undefined') ? parseInt(strid) : DATA.SKILL.ptrs[strid].getCallID();
				return res;

				} else { // if 0 is given
					return 0; // return 0

				};
				
			} else { // str given
				return DATA.SKILL.ptrs[sklid.convert(strid)].getCallID();
			};

		} catch(error) {
			errorlog(`DIS._tpc.convert_id(${strid}): Something went wrong.\n` + error)
		};
	},
	
};


/**
 * DIS.shell
 * DIS shell system (dsh) you can access on DIS game console.
 * The console can be called by pressing F10(default)
 * @namespace
 */
DIS.shell = (function(){
		const QuitSignalAdr = 183; // LEGS_ClosingConsole 
		const dshVer = "proto";

		const IND_QJS = 'qjs >';
		const MODE_QJS = 1;
		let dshmod = 0;

		let args = [];

		/**
		 *
		 * @return {bool} - continue evalQjs = true
		 */
		const evalQjs = function(st){
			if(st == "\\q"){
				dshmod = 0;
				dsLog("Quitting qjs mode...")
				return false;
			}
			try {
				eval(st);
				return true; 
			} catch(error){
				dsLog(error)
				return true;
			};
		};

		const dsLog = function(s){
			if(DEBUG == 0){console.log(s);};
			DIS.log.push(s);
		}

		const isArgHelpCalled = ()=>{return (args.length == 1) || args[1] == "--help"};

		const dshCmd = {

			echo(){

				/*
				 * UNDERCONSTRUCTION
				const ev = (s)=>{
					let out = "";
					// proc
					const MD_ADD = 0,
								MD_ESC = 0b1,
								MD_V = 0b10;
					let mode = MD_ADD;
					for (let i = 0; i < s.length; i++){
						// normal mode
						if(mode == MD_ADD){
							// espape char found
							if(i == "\\"){
								mode = ED_ESC;
							} else { // otherwise just add char
								out += s[i];
							};
						} else if(mode == MD_ESC){
								// check if the next character is "v","s","t"
								switch(s[i]){
									case 'v':
										mode |= MD_V
										break;
									case 's':
										mode |= 0b100
										break;
									case 't':
										mode |= 0b1000
										break;
									default:
										mode = 0;
								};
						} else if(mode & 0x1110){
						};
					};

					return s;
				};
				*/

				for (let i = 1; i < args.length; i++){
					dsLog(args[i]);
				};
				return true;
			},

			exit(){
				sets(QuitSignalAdr,true);
				dsLog("Quitting dsh.");
				return true;
			},

			qjs(){
				if(DEBUG >= BOOT_MODE_DEVELOPER){
					dshmod = MODE_QJS;
					dsLog("Booting qjs console mode...\nType '\\\\q' to quit qjs mode.\n" + IND_QJS );
					return true;
				} else {
					dsLog("qjs mode is limited in this boot mode. Aborted.");
					return false;
				};
			},

			clear(){
				let a = "";
				for (let i = 0; i < 128; i++){
					a += "\n";
				};
				console.log(a);
			},

			psa(){
					dsLog("underconstruction");
			},


			genMapPic: (()=>{
				const options = {

					t: ()=>{ // tile
						dsLog("genMapPic: Ordered DIS system to generate Mapdata.png in " + RTS.getCurrentMissionDirectoryPath());
						Cmd.sys._callCev(1853); // actual function is implemented as a common event
					},
					e: ()=>{ // elevation
						dsLog("genMapPic: Ordered DIS system to generate Elevation Maps in " + RTS.getCurrentMissionDirectoryPath());
						Cmd.sys._callCev(1804); // actual function is implemented as a common event

					},
					m: ()=>{ // map picture
						dsLog("genMapPic: Ordered DIS system to generate mappic.png in " + RTS.getCurrentMissionDirectoryPath());
						Cmd.sys._callCev(1854); // actual function is implemented as a common event
					},

				};

				return ()=>{
					if(isArgHelpCalled()){
						let out = ("Usage genMapPic [OPTION]\n" +
							"Generate map asset pictures in current map directory.\n現在のマップディレクトリにマップアセットデータを生成します。\n\n" +
							"-t                 generate Map Tile data. / マップタイルデータを生成します\n" +
							"-e                 generate Terrain Elevation data and png. / マップの地形高度マップ画像を生成します\n" +
							"-m                 generate Map Picture. / マップを一枚の画像として出力します\n" +
							"-A                 do All processes above at once. / 上の処理を一度に行います。\n" +
							"--help             display this help. / このヘルプを表示します");
						dsLog(out);

					} else if(options.hasOwnProperty(args[1][1])){
						return options[args[1][1]]();
					} else {
							dsLog(`genMapPic: invalid option -- ${args[1][1]}\n`+
							"Try 'genMapPic --help' for more information.")
					};
				}
			})(),

			help(){
				
				let out = ("echo [-neE]           print given string to the console. / 受け取った文字列を表示します\n" +
					"clear                 empty console messages. / ログを押し流します\n" +
					"psa                   show Presently Selected Agents. / 現在選択中のRTSエージェントの内部IDを表示します\n" +
					"qjs                   boot qjs eval mode. / qjsによるevalモードを起動します\n" +
					"exit                  close DIS shell console. / コンソールを閉じます\n" +
					"help                  this command. / このコマンドです");

				// kari, commands for map edit mode
				if(true){
					out += (
					"\ngenMapPic             generate map asset picture. / マップ用のピクチャ画像を生成します\n"

					);
				};
				
				dsLog(out);
				return true;
			},


		};

	return {
		boot(){
			dshmod = 0; // init dsh mode
			dsLog(`dsh version : ${dshVer}\nGame module: ${boot_config.module}\nType "help" for more information.`)
		},

		run(st){
			dsLog(eval(st))
		},

		/**
		 * eval.
		 *
		 * @param {string} st - given from TPC console
		 * @return {string} - result
		 */
		eval(st){
			// should I make pipeline available?
			// let stack = st.split("|"); 
			if(dshmod == 0){
				args = st.split(" ");
				// if there's console command
				if (dshCmd.hasOwnProperty(args[0])){
					try {
						dshCmd[args[0]]();

					} catch (error) {
						dsLog("hmm, something went wrong.");
						dsLog(error);
					};

				} else {

					dsLog(`dsh: ${args[0]}: command not found`);
				};
			} else if(dshmod == MODE_QJS){
				if(evalQjs(st)){dsLog(IND_QJS)};

			};
		},

	};
})();


// set DATA global pointer

function createKeyArrayFromCsvLine(tmp){
	let elms = tmp.trim().split(",")
	let elmary = [];
	elms.forEach(elm=>{elmary.push(elm);});
	return elmary;
}

/**
 * Namespace for dealing with game data.
 * Also check DATA_entity extended classes.
 * You can access DIS.data through global pointer DATA. 
 * @namespace DIS.data
 */
DIS.data = { // DIS.data

	/**
	 * Mask Templates strings for DIS-csvfying are here.
	 * @namespace csvtemp
	 */
	csvtemp: {
		TROOP: createKeyArrayFromCsvLine(`id,name,agentDefaultGrp,agentType,agentSprite,race,skin,size:0,size:1,faction,passiveId,unitclass,Lv,HP,SP,AD,AP,AR,MR,HIT,EVA,Crit,MS,WILL,MainWeapon,WEPvariations,Shield,SHDvariations,Armor,AMRvariations,Helmet,HELvariations,Accessory,ACCvariations,SubWeapon,SubWEPvariations,ReserveSetL,?,ActiveSkill:0,ActiveSkill:1,ActiveSkill:2,ActiveSkill:3,PassiveSkill,Perks1,Perks2,Perks3,Perks4,motionFlags,objFlags,AABits,ExtraSettingEv,ExtraParts,Hpreg,Spreg,AS,MoveTypeBits,AArangeMax,AArangeMin,AAmotiontime,AAcost,AAfunction,reserve,AtkTime,AAarmorEff,AAarmorPen,AAeffect,,AIFlag,spriteOffset_x,spriteOffset_y,,,,,,,,train_speed,food,wood,stone,gold,iconsprite,spawnsound,ex_spawn_cev,Description,Lore`),

	},

	init: function(){
		// this.FACTION.init(); <- rewrite this!
			this.RACE.init();
		if(!VIRTUAL_ENV){ // ignore when debug run on VIRTUAL_ENV
			this.TECH.init();
		}
			this.SKILL.init();
			// load module STATIC UNIT DATA.
			this.STATIC_UNIT.init();
			this.SKIN.init();
		// Cmd.run();
	},

	/**
	 * called by Cmd.sys.importData on RM command interpreter.
	 * 
	 * @param {object} obj - An object returned from DATA.parseDISjson().
	 */
	autoregister: function(obj){
		let registerCheck_for_DataType = (datatype)=>{
			if(obj.hasOwnProperty(datatype)){
				for (let elm of obj[datatype]){
					this[datatype].register(elm);
				};
			};
		};
		
		// Aren't there any better way to process?
		registerCheck_for_DataType("TROOP");
		registerCheck_for_DataType("STATIC_UNIT");
		registerCheck_for_DataType("SKIN");
		deblog("autoregister called!");
		deblog(Object.keys(obj));

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

			/**
			 * MAKE FUNCTION, what these fuckers doing is almost the same
			 */
			} else if (typ == "TROOP"){ // troop data 
				ptr2Res = neststart(typ,ptr2Res);
				for (let strid in dataobj[typ]){
					let nutrp = this.TROOP.createNew(strid,dataobj[typ][strid]);
					ptr2Res.push(nutrp);
				};

			} else if (typ == "STATIC_UNIT"){ // static data 
				ptr2Res = neststart(typ,ptr2Res);
				for (let strid in dataobj[typ]){
					let nutrp = this.STATIC_UNIT.createNew(strid,dataobj[typ][strid]);
					ptr2Res.push(nutrp);
				};

			} else if (typ == "SKIN"){ // SKIN data 
				ptr2Res = neststart(typ,ptr2Res);
				for (let strid in dataobj[typ]){
					let nu = this.SKIN.createNew(strid,dataobj[typ][strid]);
					ptr2Res.push(nu);
				};

			};

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
	 * If the given src object imported from json has "INHERITS" property, 
	 * then copy parent properties to the child data object.
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
		 * ATTENTION! rewrite DATA_faction constructor!!
		 * @method createNew
		 * @param {string} strid
		 */
		createNew: function(strid){
			return this[strid] = new DATA_faction(strid); // do not resgister to ptrs yet
		},

  /**
   * register given Dfac to FACTION.ptr[index].
   * @method register
   * @param {DATA_faction} Dfac
   * @param {int} index - if this parameter is not set, this function just tries to push Dfac to FACTION.ptr.
   */
		register(Dfac,index){
			index = index || this.ptrs.length;
			this.ptrs[index] = Dfac;
			this.ptrs[0] = this.ptrs.length - 1;
		},

	},

	TROOP: {

		count: 0,
		/**
		 * Just 
		 * This function won't resgister the DATA_troop to TROOP.ptrs[] alone.
		 * You need to throw the returned DATA_troop to TROOP.register() if you want to do it.
		 * @method createNew
		 * @param {string} strid - NEED CHECK IF THIS TYPE IS CORRECT
		 * @param {} srcdata - json data? I guess?
		 * @return {DATA_troop} - 
		 */
		createNew: function(strid,srcdata){
			return this[strid] = new DATA_troop(strid,srcdata); // 
		},

		/**
		 * register troop data to id array.
		 * Newly registered DATA_troop will be pushed into id array(TROOP.ptrs).
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
				};
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
	
			let csv_temp_str = DATA.csvtemp.TROOP;

			// replace language element!
			// get lang suffix for checking if there's translation for the trp.
			const lngsf = DIS.lang.currentLangsuffix;
			const translatable_elms = ["name","Description","Lore"] 

			// It works, but retarded.
			for (let strElm of translatable_elms){
				let trelm_str = strElm + lngsf; // put suffix
				if(trpdata.hasOwnProperty(trelm_str)){ // and check if the json has translation string for current language
					for (let i in csv_temp_str) {
						if (csv_temp_str[i] == strElm){
						csv_temp_str[i] = trelm_str; // If it does, replace the element name with what with suffix
							break;
						};
					};
				};
			};

			deblog(csv_temp_str) // print data format template for debug

			for (let elm of csv_temp_str){
				str += pushKeyStr(elm);
			};

			// If language system has translation string for the agent, overwrite again (IN FUTURE)
			

			deblog(str)
			return str;

		},

	}, 


	/**
	 * @namespace DIS.data.STATIC_UNIT
	 */
	STATIC_UNIT: {
		createNew: function(strid,srcdata){
			return this[strid] = new DATA_static_unit(strid,srcdata);
		},


  /**
   * init STATIC_UNIT.
	 * Import Modules/{current_module}/Data/data_static_units.json
   */
		init: function(){

			let mypath = DIS.modules.getCurrentModuleDataPath() + "data_static_units.json";
			deblog(`importing static units data: ${mypath}`);
			Cmd.sys.importData(mypath);
		},

		/**
		 * register static unit data to id array.
		 * Newly registered data will be pushed into id array(STATIC_UNIT.ptrs).
		 * If you want to add mod troop data to the game, use this method.
		 *
		 * @method register
		 * @param {DATA_troop} stadata
		 */
		register: function(stadata){
			let ls4nusta = [];
			if (Array.isArray(stadata)){ // if it's given as array
				for (let elm of stadata){
					ls4nusta.push(elm);
				}
			} else {
				ls4nusta.push(stadata);
			};


			// = index || this.ptrs[0] + 1;
			let index;
			for (let nusta of ls4nusta){
				let ck = "STA_" + nusta.id;
				if (staid.hasOwnProperty(ck)){ // override
					index = staid[ck];
					this.ptrs[index] = nusta;

				} else { // register new data

					//!!!!!!!!!!! NEED FIX !!!!!!!!!!!!!
					// ACTUALLY DATA_entity has i so static data always has i.
					index = nusta.hasOwnProperty("i") ? nusta.i : this.ptrs[0] + 1; // if index is manually set in json data, use it
					this.ptrs[index] = nusta;
				};
				this.ptrs[0] = this.ptrs.length;
				staid.register(ck,index);
			};

			deblog(`current registered static units: ${this.ptrs[0]}`);

		},

		ptrs: [0],

	}, 

	/**
	 * @namespace DIS.data.TECH
	 */
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
			index = index || this.ptrs[0] + 1; // if index is not set,then just push
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
	RACE: {

		init: function(){
			// kari.
			raceid.register("RACE_humankind",0);
			raceid.register("RACE_goblin",1);
			raceid.register("RACE_ork",2);
			raceid.register("RACE_dragon",3);
			raceid.register("RACE_undead",4);
			raceid.register("RACE_skeleton",5);
			raceid.register("RACE_minotaur",6);

		},


	},

	SKIN: {

		ptrs: [0],

  /**
   * init SKIN.
	 * Import Modules/{current_module}/Data/data_skins.json
   */
		init: function(){
			let mypath = DIS.modules.getCurrentModuleDataPath() + "data_skins.json";
			deblog(`importing skin data: ${mypath}`);
			Cmd.sys.importData(mypath);
		},

		/**
		 * これで本当に動くのか？久々だから謎, 要確認
		 * register data to id array.
		 * Newly registered data will be pushed into id array({YOURDATATYPE}.ptrs).
		 * If you want to add mod data to the game, use this method.
		 *
		 * @method register
		 * @param {DATA} data -
		 */
		register: function(data){
			let ls4nuskin = [];
			if (Array.isArray(data)){ // if it's given as array
				for (let elm of data){
					ls4nuskin.push(elm);
				}
			} else {
				ls4nuskin.push(data);
			};

			let index;
			for (let nuskin of ls4nuskin){
				let ck = "SKIN_" + nuskin.id;
				if (skinid.hasOwnProperty(ck)){ // override
					index = skinid[ck];
					this.ptrs[index] = nuskin;

				} else { // register new data
					//!!!!!!!!!!! NEED FIX !!!!!!!!!!!!!
					// ACTUALLY DATA_entity has i so static data always has i.
					index = this.ptrs[0] + 1; // if index is manually set in json data, use it
					this.ptrs[index] = nuskin;
				};
				this.ptrs[0] = this.ptrs.length;

				skinid.register(ck,index);
			};

		},

		createNew: function(strid,data){
			return this[strid] = new DATA_skin(strid,data); // do not resgister to ptrs yet
		},

	},

	ITEM: (function(){
		
		
		return {
			WEAPON: {},
			SHIELD: {},
			ARMOR: {},
			HELMET: {},
			ACCESSORY: {},
			HORSE: {},
		}
	}()),

	SKILL: {
		cnt_custom: 0,

		init(){
			this.pss_unpack_trebuchet = new DATA_skill("pss_unpack_trebuchet",{datatype:"preset",cev:1301}) 
			this.register(this.pss_unpack_trebuchet);
			deblog("EXPERIMENTAL - SKL_pss_unpack_trebuchet set in DIS.data.SKILL.init();")
		},


		/**
		 * you cannot set index unlike other DATA types.
		 * 
		 */
		register(elm){
			let index = this.ptrs.length; // if index is not set, then just push
			elm.i = index;
			this.ptrs[index] = elm;
			this.ptrs[0] = index - 1;
			if(!(elm.isPreset())){
				this.cnt_custom += 1; // if it's not preset, count up
				elm.setCallID((this.cnt_custom) * -1); // CallID set
			};
			sklid.register("SKL_" + elm.id, index);
			deblog("SKL_" + elm.id + "reg!")
		},

		/**
		 * ptrs[0] is counter
		 */
		ptrs: [0],
	},

	PARTICLE: {},

	// EVENTS?
	EFFECT: {},

};

/**
 * Just a pointer to DIS.data
 * @constant DATA
 */
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
/**
 * DISvariable.
 * This can be abolished in near future
 * @extends {DIS_entity}
 */
class DISvariable extends DIS_entity { // nonvolatile Variable for RTS mission
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

/**
 * This class manages RTS mission system.
 * Functions for Simple Triggers are here.
 * Basically loaded from missioninfo.json.
 * @class RTSmission
 */
class RTSmission {
 /**
  * constructor.
  * @param {string} infojson - Stringified missioninfo.json file.
	* If infojson parameter is missing, then the system considers the mission as a Legacy mission run without js support.
  */
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

			// set players for temp
			for (let i = 0; i < 2; i++) {
				this.essential.players[i] = new DIS_RTSplayer(i,0);
			};

		} else {
			let src;
			try {
				src = JSON.parse(infojson);
			} catch (error) {
				errorlog("missioninfo.json.txt for the current mission seems broken. Check if it's written in correct JSON format.")
				src = {name: "Couldn't read missioninfo.json.txt file for this mission"};
			};

			const getElmInSrc = (key)=>{
				if (key in src) {
					this[key] = src[key];
				};
			};

			// essential properties
			try {
				this.missionid = src.missionid;
				this.name = DIS.lang.getPropertyWithLangsuffix(src,"name");
			} catch (error) {
				errorlog(`Loaded missioninfo.json is lacking essential properties, check if both "missionid" and "name" are defined in the file.`)
			};

			// check Description
			if ("description" in src) {
				DIS.lang.getPropertyWithLangsuffix(src,"description");
			};
			
			// this.missionscript = src.missionscript || ["mymission.js"];
			getElmInSrc("missionscript")
			// this.dataextension = src.dataextension || [];
			getElmInSrc("dataextension")
			// this.startcamerapos = src.startcamerapos || [0,0];
			getElmInSrc("startcamerapos")

			// this.playcondition = src.playcondition || [];
			getElmInSrc("playcondition")

			// this.dependency = src.dependency || [];
			getElmInSrc("dependency")
			// this.icon = src.icon || "";
			getElmInSrc("icon")
			
			const getConfInSrc = (confkey,key)=>{
				if (key in src) {
					this.conf[confkey] = src[key];
				};
			};

			// this.conf.allows_pick_faction = src.allows_pick_faction || false;
			getConfInSrc("allows_pick_faction","allows_pick_faction");
			// this.conf.isSightSystemOn = src.sys_sight || false;
			getConfInSrc("isSightSystemOn","sys_sight");
			// this.conf.isMoraleSystemOn = src.sys_morale || true;
			getConfInSrc("isMoraleSystemOn","sys_morale");
			// this.conf.isLevelSystemOn = src.sys_level || false;
			getConfInSrc("isLevelSystemOn","sys_level");

			// this.conf.isLEGACYmission = src.legacymission || false;
			getConfInSrc("isLEGACYmission","legacymission");

			// map team size?
			if (typeof src.maxTeamSize != "undefined"){
				this.conf.maxTeamSize = Math.min(src.maxTeamSize,480);
			}
			setv(TPCadr.v.Adr_Mission_Agent_TeamSize_Limit,this.conf.maxTeamSize); // set team size limit

			// set player factions
			if ('default_factions' in src){
				let i = 0;
				for (let fac of src.default_factions){
					this.essential.players[i] = new DIS_RTSplayer(i,fac);
					i++;
				};
			} else {
				this.essential.players = [0,0,0]
			};
			
			// map import check
			if ('IMPORT_MAP' in src) {
				this.mapSourceDir = (src.IMPORT_MAP != "") ? src.IMPORT_MAP : this.missionid;
			} else {
				this.mapSourceDir = this.missionid;
			};



		};
		sets(457,this.conf.isLEGACYmission); // s[457] <- Is_LEGACYSTAGE
			// console.log("mapdir is "+this.mapSourceDir)
		


		this.allocVarAmount = 0;
		this.essential.mapDataDirectory = this.missionid; // initially set the same as mission
		this.passedFrame = 0; //  if DIS game is reloaded, then reload from RM var. 
	};
	
	// non-essential properties
	missionscript = ["mymission.js"];
	dataextension = [];
	startcamerapos = [0,0];
	playcondition = [];
	dependency = [];
	icon = "";
	description="";

 /**
  * createMissionVar. This one will be abolished soon
  */
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

	/**
	 * mission commands - Commands that refer files in the mission directories are here.
	 * @namespace RTSmission.Cmd
	 */
	Cmd = { 

  /**
   * importData.
   *
   * @param {string} finame - Just insert filename in directory. 
	 * The file refered like this: {RTS.mission.missionPath}/{finame}
   */
		importData(finame){
			let path = RTS.mission.missionPath + finame; // Str_MissionPath
			Cmd.sys.importData(path);
		},

		execScript(finame){
			let path = RTS.mission.missionPath + finame; // Str_MissionPath
			Cmd.sys.exec(path);

		}
	};

	/**
	 * Mission local instances.
	 * Use for temporary namespace for your mission.
	 * @namespace RTSmission.local
	 */
	local = {};
	

	/**
	 * is this even needed?
	 */
	conf = { // these matter only at the setting up mission part
		maxTeamSize:350,
		isLEGACYmission:false,
		allows_pick_faction:false,
		isSightSystemOn: true,
		isMoraleSystemOn: false,
		isLevelSystemOn: false
	};

	/**
	 * Path to mission directory.
	 * RTS.setupMission called via TPC sets this property.
	 * @property RTSmission.missionPath
	 */
	missionPath = ""; // 

	strings = {};

 /**
  * importLangString.
  *
  * @param {string} str
  */
	importLangString(str){
		let lines = str.trim().split("\n");
		lines.forEach(line => {
			parse_languageString(line,this.strings);
		});
		deblog("string imported:\n" + str);
	};
	

	essential = { // these elements must be restored when you reload the game via save/load. <- will be relocated?
		players: [],

		/**
		 * RTS entities locked by mission setting
		 * save as json
		 *
		 * each list stores int id, and if a data id is on the locklist, it cannot be produced in this RTSmission.
		 * 
		 */
		locklists: {
			techs: [],
			normalUnits: [],
			staticUnits: [],
		},

		difficulty: getv(2401), // <- RTS_Difficulty
		weatherType: 0,
		// mapDataDirectory: this.mapDataDirectory, // set in constructor
	};

	// UNCO
	ckLockList(data){
		// uh I forget if js can check class of an object <- maybe we can use datatype

	};

 /**
  * Save states of simple triggers on the RM system.
	* @method
	* @return {bool} true - Always return true unless it aborted by some error.
  */
	save = function(){

		// save triggers in queue as a string..
		let savestring = "";
		for (let elmid in this.triggers.queue){
			let i = this.triggers.queue[elmid].index; // get trigger index in RTS.createdTrgs
			savestring += i + ",";
		};
		sett(Adrt_JSSAVE_triggersQueue,savestring.slice(0,-1));

		// save player game data 
		var address = TPCadr.t.Str_playergamedata_0;
		for (let pl of this.essential.players){
			save_jsobj_as_JSON(pl.playergamedata,address)
			address++;
		};
		deblog("playerdata saved");

		return true;
	};

	// mission.restore
 /**
  * Restore js data from TPC save data.
	* @method
	* @return {bool} true - Always return true unless it aborted by some error.
  */
	restore = function(){
		// restore mission settings
		this.passedFrame = getv(Adr_world_frame); //  if DIS game is reloaded, then reload from RM var. 

		// restore player game data saved as json
		var address = TPCadr.t.Str_playergamedata_0;
		for (let pl of this.essential.players){
			pl.playergamedata = JSON.parse(gett(address));
			address++;
		};

		deblog("RTSmission restored.");
		return true;
	};

 /**
	* This function is called in every frame in actual RTS mission.
	* Called on RM system per 1f -> Dracore/module_core_RTS_mission_general.tpc
  * @method mission.run()
  */
	run = function(){
		this.passedFrame++; // + 1 frame

		// check simple triggers. if any trigger cond is fulfilled, then send signal to execute Commands
		if(this.triggers.runTriggers()){Cmd.run();};

	};

 /**
	* *OVERRIDE ME in mymission.js!*
  * This function called ONLY when the mission starts.
	* Unlike init(), startup() is not called upon loading a savegame.
	* @method RTSmission.startup()
  */
	startup = () => {/*OVERRIDE ME!*/}; 

	/*
	StartupWrapper = function(){
		this.startup()
	}; //DO NOT OVERRIDE THISONE!
	*/

	triggers = {
		
		/**
		 * Check conditions of every trigger registered to triggers.queue and call its effect.
		 * @return {bool} - Returns true if any trigger condition is fulfilled, otherwise false.
		 */
		runTriggers: function(){ 
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
				this.queue = newQue; // then renew queue.
				return true;
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

 /**
  * setTrigger.
  * Push given trigger to RTSmission.triggers.queue
  * @param {RTStrigger} trig
  */
	setTrigger = function(trig){ // {RTStrigger}
		this.triggers.queue.push(trig);
	};

 /**
  * setPlayer.
  *
  * @param {int} id
  * @param {int} faction
  */
	setPlayer = function(id,faction){ // set player in mission.
		this.essential.players[id] = new DIS_RTSplayer(id,faction); // push to players array

	};



 /**
  * this seems meaningless.
  *
  * @param {} func
  * @param {} delayframe
  */
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
 /**
  * constructor.
  *
  * @param {string} infojson - - Stringified mapinfo.json file.
	* If infojson parameter is missing, then the system considers the map as a Legacy map run without js support.
  */
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

			const getElmInSrc = (key)=>{
				if (key in src) {
					this[key] = src[key];
				};
			};

			// this.name = src.name;
			getElmInSrc("name");
			// this.mapscript = src.mapscript || ["mymap.js"];
			getElmInSrc("mapscript");
			// this.dataextension = src.dataextension || [];
			getElmInSrc("dataextension");

			// this.dependency = src.dependency || [];
			getElmInSrc("dependency");
			
			// map size
			let i = 0;
			for (let elm of src.size){
				this.size[i] = elm;
				i++;
			};

			this.heightgenType = src.heightgen || 0; // kari
			this.terrainSource = src.terrainfile || "terrain.png"; // png?
			this.tileset = src.tileset || 1; // RM tile set - if it's not defined, at least try loading 1.

					// import mission data extension
			for (let elm of this.mapscript){
				RTS.mission.Cmd.execScript(elm); // js execute order
				deblog(`map script file ${elm} will be executed`);
			};
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
	// default elements
	name = "temp_map"
	mapscript = ["mymap.js"];
	dataextension = [];
	dependency = [];
	heightgenType = 0; // kari
	terrainSource = "terrain.png"; // png?
	tileset = 1; // RM tile set - if it's not defined, at least try loading 1.
	// end


	
	
 /**
  * this function is called through mission init process on TPC.
	* first RTS.openMissionMapDataloading() is called, then mapdef.js.txt is read, then this one gets called at last.
	*
  */
	build(){
		const Adr_TileID = 2060;
		const Adr_HeightGenType = 2056;

		setv(Adr_TileID,this.tileset);
		// this.generate();
		deblog("Is this map legacy one?: "+ RTS.mission.conf.isLEGACYmission);
		if (!RTS.mission.conf.isLEGACYmission){ // not 
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

		deblog("build called");
		setv(Adr_HeightGenType,this.heightgenType);
	};
	
	
 /**
  * override me. can be written in mapdef.js.txt.
  */
	init(){return NULL;}; 


 /**
  * currently no meaning.
  */
	restore(){
		deblog("Map restored.")
	}; // call me
	
 /**
  * Generate map.
	* You CAN override this function in your js file for your map!
	* If you don't override this function, this object tries to load this.terrainSource unless the map is LEGACYmission
	* - I mean using RMmap.
  */
	generate(){ // 
		// override me
	};

 /**
  * setMapHeight.
  *
  * @param {object} heightinfo - two-dimensional array. [width][height]
	* @return {bool}
  */
	setMapTileInfo(elvinfo){
		if(Array.isArray(elvinfo)){
			// console.log(elvinfo);
			const Adr_TileInfoHead = 1182; // kari
			deblog(getv(Adr_TileInfoHead)) // kari
			setv(getv(Adr_TileInfoHead),elvinfo); 

			return true;

		} else {
			return false;
		};
	};


	
	/**
	 * ?
	 */
	gensync(){
	
	};

};
	
/**
 * DIS_RTSplayer.
 *
 * @extends {DIS_entity}
 */
class DIS_RTSplayer extends DIS_entity {
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

	
	/**
	 * properties in this object will be restored when player load a savegame
	 * 
	 */
	playergamedata = {
		troopTree: [],
		techTree: [],
		techFlags: [0,0,0,0], // new Array(4),
	};


	cohorts = [];

	combatpower = 0;

	// kari
	getTeamListHead(){return 1145 + Math.min(this.id,1)}; // ?
			


	teamAgentsList = [];

	refreshCurrentTeamList(){
		let res = [];
		let agid;
		for (let ptr = getv(this.getTeamListHead()) ; (agid = getv(ptr)) >= 1 ; ptr++ ){
			res.push(RTS.agents[agid]);
		};
		return (this.teamAgentsList = new RTSagentGroup(res,this.id));

	};

	/**
	 * setTechFlag.
	 *
	 * @param {DATA_tech} tech
	 * @return {int} - result after tech researched
	 *
	 */
	setTechFlag(tech){
		const techadd = tech.getFlagSlot();
		// set tech flag.
		return this.playergamedata.techFlags[techadd[0]] |= techadd[1];
	};

	/**
	 * Check if the player has already researched the given tech.
	 * 
	 * @param {DATA_tech} tech - 
	 * @return {int} - should I convert this bool? idk
	 */
	ckTechFlag(tech){
		const techadd = tech.getFlagSlot();
		return this.playergamedata.techFlags[techadd[0]] & techadd[1];
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

	/**
	 * Save RTSplayer.playergamedata to RPG maker string slot.
	 */
	save(){
		// save_jsobj_as_JSON(this.playergamedata, )
	};

	restore(){ 
		// restore tech info from RPG maker savedata.
	};


};


class DIS_cohort extends DIS_entity {
	constructor(team,id,agtarray){
		super();
		this.team = team;
		this.id = id;
		this.agents = agtarray;
		
		MISSION.essential.players[team].cohorts[id] = this;

	};

};



/**
 * RTStrigger.
 * Works as a simple trigger.
 * maybe you need to build up restoring processes for mission and triggers.
 *both creation and deletion of the simple triggers must be memorized in RMvar (or str) just for restoring save data. After all.
 */
class RTStrigger {
 /**
  * The constructor automatically pushes newly created RTStrigger to RTS.createdTrgs array.
  */
	constructor(){
		this.index = RTS.createdTrgs.length; // push this to created Triggers Array in RTS
		RTS.createdTrgs.push(this); // push this to created Triggers Array in RTS
	};

 /**
  * if this function returns true, then erase from triggers.
	* @return {int} - result is 2bits number. 
	* 0b10 = kill trigger, 0b01 = condition fulfilled.
  */
	run = function(){
		let result =0b00; // bit1 - triggered flag, bit2 - kill this trigger flag
		if (result |= this.condition()){ // check the condition - if it's true 0b01
			this.effect();
			return result | (!(this.isLoop) << 1); // if this trigger set to keep looping, then return 0b11. 
		};

		return result;

	};

 /**
  * override me.
	* @return {bool}
  */
	condition = function(){return true;}; // return bool. override me.

 /**
  * effect called after condition fulfilled.
	* override me.
  */
	effect = ()=>{ /* override me later in missiondef file! */ }; 

	timer = 0; // ++ in mission trigger run function.

	isLoop = false; // whether this trigger will be called even after fulfilling condition once.

	finishLoop(){this.isLoop = false};

};


class DIS_dialog extends DIS_entity {
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

/**
 * RTS system object.
 * This object manages high level stuff around RTS mode.
 * Lower level stuff are processed in TPC.
 *
 * @namespace RTS
 */
let RTS = {
	isRTSmode: false,
	mission: new RTSmission(),
	map: new RTSmap(),
	createdTrgs: [],

	/**
	 * this might be needless anymore
	 */
	savedVars: [],

	/**
	 * Variables and arrays in this name space will be saved as JSON string.
	 * Make sure opening new stage wipes out all properties in RTS.Preserve.
	 * ...But do not try saving functions.
	 * @namespace RTS.Preserve
	 */
	Preserve: {},

	/**
	 * RTS object holds each of spawned {DIS_agent} data as elements of this array.
	 * BUT HOW SHOULD I RESTORE THE DATA AFTER SAVE/LOAD?
	 */
	agents: new Array(DIS.agent.limit), // store mission vars or whatever

	/**
	 * RTS.path
	 * This manages things relating to pathfinding or agent movement order. 
	 * Beware, its properties won't be restored on loading savegame.
	 * @namespace RTS.path
	 */
	path: {
		init: function(){
			for (let i = 0; i < DIS.agent.limit; i++){
				this.PfWPbuffer[i] = [];
			};
		},

		mvgrp: [], // agent movement group
		PfWPbuffer: [], // node array stored for each agents 

		/**
		 * usually called from TPC.
		 *
		 * @param {} agentid
		 * @param {} PathArray
		 */
		storePath: function(agentid,PathArray){
			this.PfWPbuffer[agentid] = PathArray; // send PathArray to RTS.path.PfWPbuffer.
			let t = "RTS.path: stored " + PathArray; // tesT
			deblog(t);

		},


		initPath_list: function(agentidlist){ 
			for (let agt of agentidlist){
				this.PfWPbuffer[agt] = [];
			}
		},

		/**
		 *  Gives stored path to the agent and deals with array.
		 *  Returns array length without given path.
		 *  The WP array is picked up from RTS.path.PfWPbuffer[].
		 *
		 * @param {int} agentid
		 */
		givePath: function(agentid){
			
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

		/**
		 * Gives the target agent the same path as the source agent.
		 * BEWARE MAYBE THIS METHOD IS NOT TESTED YET
		 *
		 * @param {int} srcagtid - agent id of source agent
		 * @param {int} targetid - agent id of target agent
		 */
		copyPath: function(srcagtid,targetid){
			deblog(srcagtid + " to " +targetid) 
			this.PfWPbuffer[targetid] = []; // ? should I use let?

			for (let elm of this.PfWPbuffer[srcagtid]) {
				this.PfWPbuffer[targetid].push(elm);
				// deblog(elm)
			};
		},


		/**
		 * unco
		 */
		convertArrayIntoPath: function(array){
			

		},



	},


	/**
	* Radio Dialog manager.  
	* @namespace RTS.DlogManager 
	*/
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
		// Cmd.run(); // avoiding duplex call


	},

	/**
	 *  This will be called after this.setupMission().
	 *
	 * @param {string} mapdir - path to map directory.
	 */
	setupMapLoading: function(mapdir){
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


	/**
	 * RTS.save()
	 */
	save: function(){ // called whenever the game is trying to make RM savefile...
		
		// save RTS.Preserve to RM strmem[745]
		save_jsobj_as_JSON(745,this.Preserve) // Str_Mission_local_save_JSON
		// sett(745,JSON.stringify(this.Preserve));

		if(this.mission.save()) {
			deblog("RTS object data saved.");
		} else {
			errorlog("it seems RTSmission.save() failed");
		};

	}, // unco

	// 
	/**
	 * RTS.restore()
	 * call this function whenever player loads RMsavedata. reload all data from RM memories.
	 * @method
	 *
	 */
	restore: function(){
		// restore mission 
		this.setupMission(gett(741)); // read mission info json file stored in the savedata
		const str_missiondef_storage = 761; // <- header_mission.tpc

		// load mission def and setup map system
		eval(gett(str_missiondef_storage)); // kari. using eval is kinda risky, but still, I have no choice under 2003Maniacs I suppose?
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

		// moved from RTSmission.
		let saved = JSON.parse(gett(745)); // get stringfied json from RM string memory
		for (let elmid in saved){
			let elm = saved[elmid];
			if (typeof elm == "object"){
				if (Array.isArray(elm)){ // if it's array
					this.Preserve[elmid] = [];
					for (let elm_b of elm) {
						this.Preserve[elmid].push(elm_b);
					};
				} else { // otherwise just ignore, since triggers cannot be saved
					errorlog("Object that is not a simple array was saved in RTS.Preserve. Restoration process for it ignored.")
				}; 
			} else {
				this.Preserve[elmid] = elm; // just copy
			};
		};
		
		deblog(JSON.stringify(this.Preserve));
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


	getCurrentMissionDirectoryPath(){
		return this.mission.mapSourceDir; // kari
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
	CTYP_OBJ = 9,
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
	LINKSTR_obj = 779,
	LINKSTR_END = 780;


// -> module_Game_scripts_general.tpc
const adr_RMbool_RUN_CMD = 132,
	adr_RMStr_CmdOrder = 795;

/**
 * CmdRetLink.
 * It's initially designed to return value from TPC process to js.
 * Shit class, none uses it
 *
 * @class CmdRetLink
 */
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



/**
 * DIS Command Object Cmd
 * (Almost) all command functions in objects in the Cmd object will be executed on RM interpreter, not on js process.
 * @namespace Cmd
 */
var Cmd = {

	/**
	 * @type {string}
	 * Commands will be sent to RPG Maker as a string.
	 */
	CmdQueue: "",
	CmdSyncQ: "",

	ReturnQueue: [],

	/**
	 * This function is to be called by TPC. send RM stuff back to ReturnQueue.
	 * GOMI
	 *
	 * @param {} stuff
	 * @param {} linki
	 * @param {} sendwhat
	 */
	sendback: function(stuff,linki,sendwhat){
		deblog(`RetLink:sending back thing ${stuff} to returnArray[${linki}]!`)
		deblog(`${Cmd.ReturnQueue[linki]} is receiver.`)
		Cmd.ReturnQueue[linki].receive(stuff);
		deblog(`RetLink:received successfully, now to send...`)
		sendwhat = sendwhat || 0; // if 0, not designated what to send.
		Cmd.ReturnQueue[linki].send(sendwhat);
	},

	/**
	 * call this function when the game loads savedata.
	 */
	restore: function(){
		this.runFlags.initAll();
	},

	/**
	 * Command name associative array.
	 */
	CmCon: {}, 


	/**
	 * sets command order queue.
	 * 
	 * @param {int} typ - CTYP
	 * @param {string} name
	 * @param {string} ord
	 */
	Qset: function(typ,name,ord){
		let cmdid = Cmd.CmCon[name];
		Cmd.CmdQueue += (typ + "," + cmdid + "," + ord + ";");
		return true;
	},
	
	_Qnext: function(typ,name,ord){
		let cmdid = Cmd.CmCon[name];
		Cmd.CmdSyncQ += (typ + "," + cmdid + "," + ord + ";");
		return false;
	},

	/**
	 *
	 * @param {object} - object that has {bool} isCertified property 
	 */
	_CmdAwaitQ: function(obj,typ,nam,ord){
		let fn = (obj.isCertified) ? this.Qset.bind(this) : this._Qnext.bind(this);
		return fn(typ,nam,ord);
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

		// this one might be needless
		for (let i = LINKSTR_map;i < LINKSTR_END;i++){
			let container = gett(i); // get scripts/const_troops.txt
			container = container.replace(/<.*?>/g, "");
			let lines = container.trim().split(";");
			lines.forEach(line => {
					parse_simpleid(line,this.CmCon);
			});
		}

	},

	/**
	 * Cmd.run()
	 * give signal to run DIS commands 
	 * Mainly called in cev 1830("JS mission/command manager") in module_core_RTS_mission_general.tpc
	 * And mission.run()
	 *
	 */
	run: function() {

		// give raw cmd as a string to RPGMaker
		sett(adr_RMStr_CmdOrder,this.CmdQueue);
		// turn on RM switch to run interpreter as cev
		sets(adr_RMbool_RUN_CMD,1);
		// deblog(Cmd.CmdQueue)
		this.CmdQueue = this.CmdSyncQ; // refresh Command Order
		this.CmdSyncQ = ""; // init next Command Order
		 
		// return queue is cleared after TPC finishes actual Cmd processes
		this.runFlags.initAll();
	},
	

	// actual command objects start 
	//Cmd.game
	
	/**
	 * Commands that 
	 * @namespace
	 */
	game: (function(){
		/**
		 * CTYP_GAME 
		 */
		let CmdType = CTYP_GAME;
		return {

			/**
			 * Just play Global SE.
			 *
			 * @param {string} file 
			 * @param {int} vol
			 * @param {int} tempo
			 * @param {int} ballance
			 */
			playGlobalSE: function(file,vol,tempo,ballance) { // "cmd_play_global_sound"
				Cmd.Qset(CmdType,"pGSE",`${file},${vol},${tempo},${ballance}`);
			},

			playBGM: function(file,vol,tempo,ballance) { // "cmd_play_global_sound"
				Cmd.Qset(CmdType,"pBGM",`${file},${vol},${tempo},${ballance}`);
			},


			/**
			 * @wait command in TPC.
			 * YOU SHOULDN'T USE THIS METHOD IN RTS GAME UNLESS YOU UNDERSTAND HOW IT AFFECTS TO PROCESS.
			 *
			 * @param {} RMwaittime
			 */
			wait: function(RMwaittime) { // RMwaittime: 10 = 1sec, 0 = 1f, -n = {n}f. 
				Cmd.Qset(CmdType,"wait",`${RMwaittime}`);
				Cmd.runFlags.RMwaitDetect = true;
			},

			/**
			 * methods around picture files.
			 * @namespace Cmd.pic
			 *
			 */
			pic: { // Cmd.pic
				CmdType: CTYP_GAME,

				/**
				 * load picture command.
				 * @param {int} filepath
				 * @param {int} picid
				 *
				 * @returns {DIS_RMpicture} RPG Maker picture 
				 *
				 */
				load: function(filepath,picid) { // simply load a picture file to picid 
					Cmd.Qset(CmdType,"loadPic",`${filepath},${picid}`);
					return (new DIS_RMpicture(picid,filepath)); // no pos gg
				},

				/**
				 * remove picture command.
				 * 
				 *
				 * @param {int} picid
				 *
				 */
				remove: function(picid) {
					Cmd.Qset(CmdType,"removePic",`${picid}`);
				},


				/**
				 * UNCO.
				 *
				 * @param {} path
				 * @param {} key
				 * @param {} namespace
				 */
				loadToCache: function(path,key,namespace = "misc"){
					// if given namespace is new one
					if (typeof DIS.cache[namespace] === "undefined"){
						DIS.cache[namespace] = {}; // make it blank object 
					};
					Cmd.Qset(CmdType,"cachePic",`${path},DIS.cache.${namespace}.${key}`);
					return DIS.cache[namespace][key] = new RM_PicCache(path,key,namespace);
				},

				/**
				 * 
				 * If target cachedPic is not gotten yet, push this command to next cycle
				 * @param {RM_PicCache} 
				 * @param {int} 
				 * @param {[int,int]} 
				 */
				pasteFromCache: function(cachedPic,pid,origin = [0,0]){
					Cmd._CmdAwaitQ(cachedPic,CmdType,"pstCchPc",`${cachedPic.getAdr()},${pid},${origin[0]},${origin[1]}`);
				},


			},

			/**
			 * .
			 *
			 * @param {} filepath
			 */
			loadText: function(filepath) { 
				Cmd.Qset(CmdType,"loadText",`${filepath}`);
			},

			/**
			 * .
			 *
			 * @param {int} stringid
			 * @param {string} filepath
			 */
			exportText: function(stringid,filepath) {
				Cmd.Qset(CmdType,"exportText",`${stringid},${filepath}`);
			},

			/**
			 * .
			 *
			 * @param {} RGBS
			 * @param {} f
			 */
			tintScreen: function(RGBS,f) {
				f = f || 0;
				let st = RGBS.join(",") + "," + f;
				Cmd.Qset(CmdType,"tintScreen",st);
				deblog(st)
			},

			/**
			 * .
			 *
			 * @param {int} RMmapid
			 * @param {[int,int]} tilepos
			 */
			gotoRMmap: function(RMmapid,tilepos) { //
				tilepos = tilepos || [0,0]
				Cmd.Qset(CmdType,"gotoRMmap",`${RMmapid},${tilepos[0]},${tilepos[1]}`);
			},


			// log series

			/**
			 * unlike Cmd.game.log(), argument will be processed by DIS.string.convertString()
			 * If you want to use message system as a function of your RTS stage, you should use this than Cmd.game.log()
			 *
			 * @param {string} txt
			 */
			msg: function(txt){
				txt = DIS.string.convertString(txt)
				Cmd.Qset(CmdType,"msg",`${txt}`);
			},

			/**
			 * Show raw string.
			 *
			 * @param {string} txt
			 */
			log: function(txt){
				Cmd.Qset(CmdType,"msg",`${txt}`);
			},

			log_error: function(txt){
				let t = `\\C[17]ERROR:${txt}`;
				Cmd.Qset(CmdType,"msg",t);
				return t;
				// deblog("`ERROR:${txt}`")
			},

			log_dev: function(txt){
				let t = `\\C[1]Dev:${txt}`;
				Cmd.Qset(CmdType,"msg",t);
				return t;
			},	

			log_debug: function(txt){
				let t = `\\C[5]JS DEBUG:${txt}`;
				Cmd.Qset(CmdType,"msg",t);
				return t;
			},	

			//


		};
	})(),

	/**
	 * Cmd.map
	 * namespace for Commands that affect RTS game map.
	 * RTSマップに干渉するタイプのコマンド集
	 * @namespace Cmd.map
	 */
	map: {
		CmdType: CTYP_MAP,
		
		
		/* spawnerInfoUpdate: ()=> {
			if (Cmd.bl_SpawnCmdCalled == false){}
		} need to consider well */ 

		// {int}, array[x,y]

		/**
		 * Spawns an unit as a agent to given pos in RTS map.
		 *
		 * @param {trpid} troopid
		 * @param {[int,int]} tilepos
		 * @param {int} team
		 * @param {int} dir
		 * @param {int} stance
		 * @param {} flag
		 */
		spawnAgent: function(troopid,tilepos,team,dir,stance,flag){ // returns DIS_agent
			troopid = trpid.convert(troopid);
			dir = dir || Cmd.runFlags.spawnagent_lastdir;
			stance = stance || 0;
			flag = flag || 0;
			
			Cmd.Qset(this.CmdType,"spnAg",`${troopid},${tilepos[0]},${tilepos[1]},${team},${dir},${stance}`);
			let protoagent = new DIS_agent(DIS.agent.searchEmptySpace(),troopid,team,false);

			Cmd.runFlags.spawnagent_lastdir = dir
			return protoagent;
		},

		/**
		 * Spawns group of agents on map.
		 * And returns {RTSagentGroup}
		 *
		 * @param {string} troopid - "TRP_brabra". may work with int but highly recommend using stringid.
		 * @param {[int,int]} tilepos - 
		 * @param {int} team - 
		 * @param {[int,int]} delta -
		 * @param {int} amount - 
		 * @param {int} dir -
		 * @param {int} stance - 
		 * @param {} flag
		 * @return {RTSagentGroup} -
		 */
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

		/**
		 * 
		 * @param {*} static unit ID 
		 * @param {[int,int]} tilepos 
		 * @param {int} team 
		 * @return {DIS_agent} - Spawned static
		 */
		spawnStatic: function(staticID,tilepos,team){
			Cmd.Qset(this.CmdType,"spnSt",`${staticID},${tilepos[0]},${tilepos[1]},${team}`);
			let protostatic = new DIS_agent(DIS.agent.searchEmptySpace(),staticID,team,false);
			return protostatic;
			
		},

		/**
		 * Spawns palisade.
		 *
		 * @param {[int,int]} tileposbeg
		 * @param {[int,int]} tileposend
		 * @param {int} team
		 * @return {DIS_agent} - Spawned Palisade... this will be changed into {DIS_agent_static}
		 */
		spawnPalisade: function(tileposbeg,tileposend,team){ // returns DIS_agent
			Cmd.Qset(this.CmdType,"spawnPalisade",`${tileposbeg[0]},${tileposbeg[1]},${tileposend[0]},${tileposend[1]},${team}`);
			let protostatic = new DIS_agent(DIS.agent.searchEmptySpace(),staid["STA_palisade"],team,false);
			return protostatic;
		},

		/**
		 * Spawns wall.
		 *
		 * @param {int} tileposbeg
		 * @param {int} tileposend
		 * @param {int} team
		 * @return {DIS_agent} - this will be changed into {DIS_agent_static}
		 */
		spawnWall: function(tileposbeg,tileposend,team){ // returns DIS_agent
			Cmd.Qset(this.CmdType,"spawnWall",`${tileposbeg[0]},${tileposbeg[1]},${tileposend[0]},${tileposend[1]},${team}`);
			let protostatic = new DIS_agent(DIS.agent.searchEmptySpace(),staid["STA_wall"],team,false);
			return protostatic;
		},

		/**
		 * just let the DIS generate height map 
		 * underconstruction
		 */
		generateHeightmap: function(){ // generate heightmap
			Cmd.Qset(this.CmdType,"genHeightmap",""); // just do it
		},


	},

	//Cmd.sys
	/**
	 * Collection of commands related to fundamental system operations such as data loading.
	 * データロード等、根幹的なシステムに関連するコマンド集
	 * @namespace 
	 */
	sys: (function(){
		const CmdType = CTYP_SYS; 

			return {

				exec: (jsfile)=> { // execute js file
					Cmd.Qset(CmdType,"exec",`${jsfile}`);
				},

				eval: (jsSentence)=> { // eval(jsSentence) on the DISCmd interpreter. might be dangerous 
					Cmd.Qset(CmdType,"eval",`${jsSentence}`);
				},

				/**
				 * automatically import game data written in json format.
				 * if you want to import mission local data, then try using 
				 * -> MISSION.local.importData() 
				 * @method importData
				 * @param {string} path Root directory is the game directory. Also you need not to write .json.txt
				 */
				importData: (path)=>{
					const lastDotIndex = path.lastIndexOf('.');
					if (lastDotIndex !== -1) {
						let extension = path.slice(lastDotIndex + 1);
						if (extension != "json"){
							errorlog(`Cmd.sys.importData(${path}) loads only json/json.txt file. Also you need not to put extension`)

						}
					} else {
						path += ".json"

					}

					Cmd.Qset(CmdType,"importDISDjson",`${path}`);
				},

				/**
				 * Load up java script library in /Scripts/jslib/.
				 * Don't call this command unless you understand what are gonna do.
				 * @param {string} libfile - e.g. "perlin.js"
				 *
				 */
				_loadlib: (libfile)=>{ // execute js file
					Cmd.Qset(CmdType,"loadlib",`${libfile}`);
				},

				/**
				 * danger. never use this cmd unless you're aware of DIS RM string memory allocation
				 *
				 * @param {string} path Starts from game directory.
				 * @param {RM_ADRT} Adrt 
				 */
				loadtext: (path,Adrt)=>{
					Cmd.Qset(CmdType,"loadtxt",`${path},${Adrt}`);
				},

				/**
				 * danger. never use this cmd unless you know what you are doin
				 *
				 * @param {int} cev - common event id
				 */
				_callCev: (id)=>{
					Cmd.Qset(CmdType,"cev",`${id}`);
				},

			};
	})(),


	// -------------
	// Cmd.mission 
	// -------------
	/**
	 * @namespace
	 */
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
		/**
		 * - enable quitting RTS map by pressing Tab key.
		 */
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

		/**
		 * Allows a player to show all map terrain.
		 * Fog of war won't be removed.
		 * @param {int} playerid 
		 */
		revealMap: function(playerid){ 
			Cmd.Qset(this.CmdType,"rvMap",`${playerid}`);
		},

		/**
		 * Move player camera position to designated point
		 * @param {[int,int]} tilepos 
		 */
		moveCamera: function(tilepos){
			Cmd.Qset(this.CmdType,"mvCam",`${tilepos[0]},${tilepos[1]}`);
		},

		/**
		 * Toggle game pause or not.
		 *
		 * @param {bool} bool - pause or not
		 */
		togglePause: function(bool){
			let sw = Number(bool)
			Cmd.Qset(this.CmdType,"tgPaus",`${sw}`);
		},

		/**
		 * underconstruction.
		 *
		 * @param {int} playerid
		 * @param {} resource
		 * @param {} amount
		 */
		giveResource: function(playerid,resource,amount){ // not done
			Cmd.Qset(this.CmdType,"giveRs",`${playerid},${resource},${amount}`);
		},

		/**
		 * underconstruction (need to write TPC proc for this func).
		 * set given flag to RTSplayer.playergamedata.techFlags[] on js as well
		 *
		 * @param {int} playerid
		 * @param {string} techid
		 */
		giveTech: function(playerid,tech){ // not done
			let convt = DATA.TECH.ptrs[[techid.convert(tech)]].getFlagAddress();
			Cmd.Qset(this.CmdType,"giveTech",`${playerid},${convt[0]},${convt[1]}`);
			return RTS.mission.essential.players[playerid].setTechFlag(convt);
			
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


	/**
	 * Radio Dialogs and etc etc
	 * @namespace Cmd.ui
	 */
		ui: {
			CmdType: CTYP_UI,
			
	/**
	 * Sends very simple dialog to Radio dialog manager.
	 * Returns nothing.
	 *
	 * @param {string} txt
	 * @param {int} time
	 * @param {} face
	 */
			sendSimpleDialog: function(txt,time,face){
				let log = new DIS_dialog(txt,time,face);
				_pushDialogQueue(log);
			},

			/**
			 * Send push Dialog queue command to RPG maker.
			 * Called by other methods in Cmd.ui
			 *
			 * @param {} dlog
			 */
			_pushDialogQueue: function(dlog){ // push arg to dialog queue and toggle dialog manager switch
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

	/**
	 * This has similar functions with Cmd.map,
	 * but methods in this object tend to deal with more complicated classes
	 * @namespace Cmd.obj
	 */
	obj: (function(){
		// CmdType as a private const is better. Other objects in Cmd will also be refactored in this way.
		const CmdType = CTYP_OBJ;
		
		return {

			/**
			 * Simillar to Cmd.map.spawnAgent(), but uses DIS_unit as param.
			 *
			 * @param {DIS_unit} unit - DO NOT USE trpid here, you need to prepare DIS_unit type object.
			 * @param {[int,int]} tilepos - [x,y]
			 * @param {int} team - 
			 * @param {int} dir - 
			 * @param {int} stance - 
			 * @param {} flag
			 * @return {DIS_agent}
			 */
			placeUnitAsAgent: function(unit,tilepos,team,dir,stance,flag){
				// UNCO
				var troopid = 0; // get from DIS_unit
				dir = dir || Cmd.runFlags.spawnagent_lastdir;
				stance = stance || 0;
				flag = flag || 0;

				Cmd.Qset(CmdType,"plcAg",`${troopid},${tilepos[0]},${tilepos[1]},${team},${dir},${stance}`);
				let protoagent = new DIS_agent(DIS.agent.searchEmptySpace(),troopid,team,false);

				/*
				 copy EX events from given DIS_unit
				 */

				Cmd.runFlags.spawnagent_lastdir = dir
				return protoagent;
			},
		};

	})(),



};


// ----------------------------------
// DIS Player UI system
// ----------------------------------

// DUI init process is run after disrc.js in user directory?
// is it actually called? can we integate this into DIS object?

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

/**
 * DIS js GUI system - DGUI
 *
 */
// import NsGUI and refer as DGUI
let DGUI;
if (typeof NsGUI == "undefined"){
	deblog("Attention: NsGUI is missing.")
	DGUI = {}; // NS gui is missing

	// NsGUI is found
} else {
	DGUI = NsGUI;

	// override mouse state get function for DIS project
	DGUI.wrappers.getMouseState = function() {
		const MB = getv(43);
		let state = [
			[getv(51),getv(52)], // [x,y]
			(MB == 1005), // LMB trig
			(MB == 1006), // RMB trig
			0, // MB3 trig
			getv(1236), // MB4 trig
			getv(1235), // MB5 trig
			0, // wheelUp
			0, // wheelDown
		];
		return state;
	};

};


// init load
if (!VIRTUAL_ENV){
	DIS.init.loadBootconf();
	Cmd.init();
	DIS.data.init(); // reset DIS data
	DIS.init.initID();

	// Cmd.game.pic.loadToCache("camera_ball","test");
	// Cmd.game.pic.pasteFromCache(DIS.cache.misc.test,800)
};




// without RPG_RT.exe
if (VIRTUAL_ENV){
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
			"name_jp": "オトナス・ナスン・ソラヌム",
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
		"INHERITS": "dra_hero_orthunass",
		"name_jp": "ウィスナ"

	}

}
}
`
	DATA.init();
	facid.FAC_dra = 114514;
	raceid.RACE_dragon = 4545;
	DATA.parseDISjson(roottroop)
	DATA.parseDISjson(sampletrp)
	deblog("\n\n\n")
	DIS.lang.currentLangsuffix = "_jp"
	DATA.TROOP.convertIntoCsvLine(DATA.TROOP.dra_hero_orthunass);
	deblog("\n\n\n")
	DATA.autoregister(DATA.parseDISjson(inheritancetest))


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
`;


};



// Bilinear picture size changing functions.
// NEED REORGANIZATION
// basically written by GPT so you need to fix these anyway
// TODO: calc as float and round into int just before pushing into array.
function linearInterpolate(color1, color2, factor) {
	const a1 = (color1 >> 24) & 0xff;
	const r1 = (color1 >> 16) & 0xff;
	const g1 = (color1 >> 8) & 0xff;
	const b1 = color1 & 0xff;

	const a2 = (color2 >> 24) & 0xff;
	const r2 = (color2 >> 16) & 0xff;
	const g2 = (color2 >> 8) & 0xff;
	const b2 = color2 & 0xff;

	const r = Math.round(r1 + factor * (r2 - r1));
	const g = Math.round(g1 + factor * (g2 - g1));
	const b = Math.round(b1 + factor * (b2 - b1));
	const a = 0xff // Math.round(a1 + factor * (a2 - a1)); // With current 2003MP, you need not to consider about alpha channel

	return (a << 24) | (r << 16) | (g << 8) | b;
}

function getPixel(imageData, width, height, x, y) {
	if (x < 0 || x >= width || y < 0 || y >= height) {
		return 0; // If the pixel is out of picture, just return 0. 範囲外の場合は黒（または透明）を返す
	}
	return imageData[y * width + x];
}

function resizeImage(imageData, originalWidth, originalHeight,rate) {
	let newWidth = originalWidth * rate;
	let newHeight = originalHeight * rate;
	const resizedData = [];

	for (let y = 0; y < newHeight; y++) {
		for (let x = 0; x < newWidth; x++) {
			const srcX = (x / newWidth) * originalWidth;
			const srcY = (y / newHeight) * originalHeight;

			const x0 = Math.floor(srcX);
			const x1 = Math.min(Math.ceil(srcX), originalWidth - 1);
			const y0 = Math.floor(srcY);
			const y1 = Math.min(Math.ceil(srcY), originalHeight - 1);

			const factorX = srcX - x0;
			const factorY = srcY - y0;

			const p1 = getPixel(imageData, originalWidth, originalHeight, x0, y0);
			const p2 = getPixel(imageData, originalWidth, originalHeight, x1, y0);
			const p3 = getPixel(imageData, originalWidth, originalHeight, x0, y1);
			const p4 = getPixel(imageData, originalWidth, originalHeight, x1, y1);

			const p12 = linearInterpolate(p1, p2, factorX);
			const p34 = linearInterpolate(p3, p4, factorX);
			const pFinal = linearInterpolate(p12, p34, factorY);

			resizedData[y * newWidth + x] = pFinal;
		};
	};
	return resizedData;
};

deblog(DIS.string)

