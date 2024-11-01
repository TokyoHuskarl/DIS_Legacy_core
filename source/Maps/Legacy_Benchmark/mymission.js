
{ // Mission config
	RTS.mission.conf.isSightSystemOn = false;
	RTS.mission.setPlayer(0,1); // player, imperials
	RTS.mission.setPlayer(1,3); // enemy, dragons

}


RTS.mission.startup = function(){

	// Player troops begin

	let cohort1 = Cmd.map.spawnAgentgroup(trpid["TRP_imperial_horse_archer"],[60,94],TEAM_PLAYER,[0,-1],4);
	cohort1.compoundAgtGroup(Cmd.map.spawnAgentgroup(trpid["TRP_imperial_horse_archer"],[58,94],TEAM_PLAYER,[0,-1],4));
	Cmd.group.registerCohort(cohort1,0,1);

	let cohort2 = Cmd.map.spawnAgentgroup(trpid["TRP_imperial_foederati"],[83,76],0,[-2,0],10,0,0);
	cohort2.compoundAgtGroup(Cmd.map.spawnAgentgroup(trpid["TRP_imperial_limitanei"],[83,78],TEAM_PLAYER,[-2,0],10));
	Cmd.group.registerCohort(cohort2,0,2);

	let cohort3 = Cmd.map.spawnAgentgroup(trpid["TRP_imperial_comitatenses_shield"],[94,93],TEAM_PLAYER,[-1,-1],8);
	cohort3.compoundAgtGroup(Cmd.map.spawnAgentgroup(trpid["TRP_imperial_comitatenses_menavlion"],[92,93],TEAM_PLAYER,[-1,-1],8));
	Cmd.group.registerCohort(cohort3,0,3);

	let cohort4 = Cmd.map.spawnAgentgroup(trpid["TRP_imperial_foederati"],[90,103],TEAM_PLAYER,[-1,1],10);
	cohort4.compoundAgtGroup(Cmd.map.spawnAgentgroup(trpid["TRP_imperial_limitanei"],[88,103],TEAM_PLAYER,[-1,1],10));
	Cmd.group.registerCohort(cohort4,0,4);

	let cohort5 = Cmd.map.spawnAgentgroup(trpid["TRP_imperial_archer"],[74,101],TEAM_PLAYER,[0,1],9);
	cohort5.compoundAgtGroup(Cmd.map.spawnAgentgroup(trpid["TRP_imperial_elite_archer"],[72,101],TEAM_PLAYER,[0,1],9));
	Cmd.group.registerCohort(cohort5,0,5);

	let cohort6 = Cmd.map.spawnAgentgroup(trpid["TRP_imperial_cav"],[78,101],TEAM_PLAYER,[0,-1],7);
	cohort6.compoundAgtGroup(Cmd.map.spawnAgentgroup(trpid["TRP_imperial_cav"],[80,101],TEAM_PLAYER,[0,-1],7));
	Cmd.group.registerCohort(cohort6,0,6);

	let cohort7 = Cmd.map.spawnAgent("TRP_imperial_hero_ghurkag_2",[47,60],TEAM_PLAYER);
	cohort7.compoundAgtGroup(Cmd.map.spawnAgentgroup("TRP_imperial_vet_aux_heavy",[47,64],TEAM_PLAYER,[0,1],7));
	Cmd.group.registerCohort(cohort7,0,7);

	let cohort8 = Cmd.map.spawnAgentgroup("TRP_imperial_vet_goblin_skirmisher",[43,34],TEAM_PLAYER,[0,1],10);
	Cmd.group.registerCohort(cohort8,0,8);


// enemy troops begin
/*
//North
//Battle Cavs
spawn_unit_group(98,175,19,1,1,1,0,1,8)
spawn_unit_group(98,177,19,1,1,1,0,1,8)
spawn_unit_group(98,179,19,1,1,1,0,1,8)

//Mid North
//Mid
spawn_unit_group(94,158,40,1,2,1,0,1,12)
spawn_unit_group(94,160,40,1,2,1,0,1,12)
spawn_unit_group(105,162,40,1,2,1,0,1,12)

//Mid
spawn_unit(69,173,57,1,3,1)

spawn_unit_group(95,175,66,1,3,1,0,1,12)
spawn_unit_group(95,177,66,1,3,1,0,1,12)
spawn_unit_group(5,179,66,1,3,1,0,1,12)

//MidEast1
spawn_unit_group(97,183,98,1,4,1,1,1,9)
spawn_unit_group(97,185,98,1,4,1,1,1,9)
spawn_unit_group(97,187,98,1,4,1,1,1,9)

//MidEast2
spawn_unit_group(5,170,116,1,5,1,0,1,12)
spawn_unit_group(96,172,116,1,5,1,0,1,10)
spawn_unit_group(96,174,116,1,5,1,0,1,10)

//Skirmishers
spawn_unit_group(6,128,45,1,0,1,2,3,20)
 */
};
