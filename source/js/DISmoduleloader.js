// DIS moduleinfo loader

// parse t[520] <- Str_moduleinfo
let moduleinfo;

try {
	moduleinfo = JSON.parse(gett(520));
	moduleinfo.getModuleInfoForTitle = function(){
		
		return (this.name + " " + this.version )

	};

} catch(error) {
	moduleinfo = {
		name: "undefined",
		version: "undefined",
		getModuleInfoForTitle(){
		
		return ("\\c[17]ERROR: moduleinfo.json is missing!")

		},
	};
};


// return t[520] to current version
sett(520,moduleinfo.getModuleInfoForTitle());
