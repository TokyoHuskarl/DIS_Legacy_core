// mission script for poteton training

RTS.Preserve.trig1 = RTS.mission.createSimpleTrigger_Timer(0,0,1); // class RTStrigger(condtion)
RTS.Preserve.trig2 = RTS.mission.createSimpleTrigger_Timer(0,0,20); // class RTStrigger(condtion)
RTS.Preserve.loop_enMove = RTS.mission.createSimpleTrigger_Loop(500);
RTS.Preserve.loop_gameend = RTS.mission.createSimpleTrigger_Loop(500);

RTS.Preserve.trig1.effect = () => {
	Cmd.ui.pushDialogQueue(new DIS_dialog("$mstr_OP1",33));
	Cmd.ui.pushDialogQueue(new DIS_dialog("$mstr_OP2",33));
	Cmd.ui.pushDialogQueue(new DIS_dialog("$mstr_Hint1",33));
};


// battle 
RTS.Preserve.trig2.effect = () => {
	Cmd.ui.pushDialogQueue(new DIS_dialog("$mstr_EnemyCharge",33));
	Cmd.ui.pushDialogQueue(new DIS_dialog("$mstr_Hint2",33));
	
	MISSION.setTrigger(RTS.Preserve.loop_gameend);

};

// 
RTS.Preserve.loop_enMove.effect = ()=> {
	
/*
	cond_switch_on(402)
	AI_cohort_simple_reassign(1)
	AI_select_cohort(1,11)
	team_get_SP(0)
	AI_cmd_move_line(1,1)
	
	AI_select_cohort(1,13)
	team_get_SP(0)
	AI_cmd_move_line(1,0)
	
	AI_select_cohort(1,12)
	team_get_SP(0)
	AI_cmd_move_line(1,1)

	AI_select_cohort(1,14)
	team_get_SP(0)
	AI_cmd_move_line(1,0)
*/

};

//
RTS.Preserve.loop_gameend.effect = function() {
	// player victory
	if (g_PLAYER.getCombatPower() <= 4){

		Cmd.ui.pushDialogQueue(new DIS_dialog("$mstr_Def1",33));
		Cmd.ui.pushDialogQueue(new DIS_dialog("$mstr_Def2",33));
		Cmd.mission.defeat(0);
		this.finishLoop()

	// player defeat
	} else if (g_ENEMY.getCombatPower() <= 8){

		Cmd.ui.pushDialogQueue(new DIS_dialog("$mstr_Vic1",33));
		if (g_PLAYER.combatpower < 24){
			Cmd.ui.pushDialogQueue(new DIS_dialog("$mstr_Vic2",33));
		};

		Cmd.mission.victory(0);
		this.finishLoop()
	};
	
};






// start up process
RTS.mission.startup = function(){
	MISSION.setTrigger(RTS.Preserve.trig1);
	MISSION.setTrigger(RTS.Preserve.trig2);
	//Ally
	//犠牲者十人未満はいける

	//1st Inf cohort
	let cohortptr;
	cohortptr = Cmd.map.spawnAgentgroup("TRP_poteton_inf",[28,27],TEAM_PLAYER,[0,1],7,0);
	cohortptr.compoundAgtGroup(Cmd.map.spawnAgentgroup("TRP_poteton_inf",[30,27],TEAM_PLAYER,[0,1],7));
	Cmd.group.registerCohort(cohortptr,TEAM_PLAYER,1);

	//Spearmen
	cohortptr = Cmd.map.spawnAgentgroup("TRP_poteton_levy_pike",[17,34],TEAM_PLAYER,[0,1],8);
	cohortptr.compoundAgtGroup(Cmd.map.spawnAgentgroup("TRP_poteton_levy_pike",[19,36],TEAM_PLAYER,[0,1],8));
	Cmd.group.registerCohort(cohortptr,TEAM_PLAYER,2);

	//Crossbowmen
	cohortptr = Cmd.map.spawnAgentgroup("TRP_merc_crossbow",[20,28],TEAM_PLAYER,[0,1],5);
	cohortptr.compoundAgtGroup(Cmd.map.spawnAgentgroup("TRP_merc_crossbow",[18,28],TEAM_PLAYER,[0,1],5));
	Cmd.group.registerCohort(cohortptr,TEAM_PLAYER,3);

	//Cav
	cohortptr = Cmd.map.spawnAgentgroup("TRP_poteton_vet_cav",[24,23],TEAM_PLAYER,[1,1],3);
	cohortptr.compoundAgtGroup(Cmd.map.spawnAgentgroup("TRP_merc_cav",[22,24],TEAM_PLAYER,[1,1],3));
	Cmd.group.registerCohort(cohortptr,TEAM_PLAYER,4);

	//Cmd.map.spawnAgentgroup("TRP_poteton_banner",[23,27],TEAM_PLAYER,[0,0],1);

	//Enemies

	Cmd.map.spawnAgentgroup("TRP_imperial_slime",[78,33],TEAM_ENEMY,[1,0],9,1);
	Cmd.map.spawnAgentgroup("TRP_imperial_levy_orc",[80,32],TEAM_ENEMY,[1,0],10);

	Cmd.map.spawnAgentgroup("TRP_imperial_aux_skirmisher",[75,37],TEAM_ENEMY,[1,1],5);
	Cmd.map.spawnAgentgroup("TRP_goblin_archer",[78,35],TEAM_ENEMY,[1,1],8);

	Cmd.map.spawnAgentgroup("TRP_imperial_aux_spearman",[78,15],TEAM_ENEMY,[1,0],5);
	Cmd.map.spawnAgentgroup("TRP_imperial_aux_spearman",[76,16],TEAM_ENEMY,[1,0],5);

	Cmd.map.spawnAgentgroup("TRP_imperial_aux_wolfrider",[90,11],TEAM_ENEMY,[1,0],8);

	Cmd.map.spawnAgentgroup("TRP_imperial_minotaur",[73,28],TEAM_ENEMY,[1,0],1);
	Cmd.map.spawnAgentgroup("TRP_imperial_goeteia",[88,30],TEAM_ENEMY,[1,0],1);


};



