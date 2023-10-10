// DIS module loader


// parse t[520] <- Str_moduleinfo
const moduleinfo = JSON.parse(gett(520));

moduleinfo.getModuleInfoForTitle = function(){
	
	return (this.name + " " + this.version )

};

// return t[520] to current version
sett(520,moduleinfo.getModuleInfoForTitle());
