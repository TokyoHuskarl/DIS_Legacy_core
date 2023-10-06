// DIS legacy faction data in new js format!

// ---------------------------------
// Imperials
// ---------------------------------

let cf = DATA.faction.imperial;
{
	cf.name = "Imperium Rtpium",

	cf.trpTree= {
		townsman: trpid["TRP_imperial_townsman"],
		scout: trpid["TRP_imperial_probebot"],

		// Barrack
		shield: [trpid["TRP_imperial_slime"],trpid["TRP_imperial_limitanei"],trpid["TRP_imperial_foederati"],trpid["TRP_imperial_aux_heavy"]],
		twohand: [trpid["TRP_imperial_levy_orc"],trpid["TRP_imperial_aux_spearman"],trpid["TRP_imperial_minotaur"],trpid["TRP_imperial_aux_shocktroop"]],
		archer: [trpid["TRP_goblin_archer"],trpid["TRP_imperial_archer"],trpid["TRP_imperial_elite_archer"],trpid["TRP_imperial_greenskin"]],
		exfootman: [trpid["TRP_imperial_aux_skirmisher"],trpid["TRP_imperial_vet_goblin_skirmisher"]],

		// Stable
		cav: [trpid["TRP_imperial_aux_wolfrider"],trpid["TRP_imperial_cav"],trpid["TRP_imperial_elite_cav"]],
		knight: [0,trpid["TRP_imperial_shockcav"]],
		horsearcher: [0,trpid["TRP_imperial_horse_archer"],trpid["TRP_imperial_mameluke"]],
		excav: [trpid["TRP_imperial_camel"]],

		// mage: [],

	}
}


// ---------------------------------
//
// ---------------------------------
