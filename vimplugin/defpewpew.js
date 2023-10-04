// set here
const m = 100; // 任意の回数を設定します
const cmdstring = "Sdefv 1 $"
const head = 3000
const FILESTRING = `
GETKEY_A=901
GETKEY_B=902
GETKEY_C=903
GETKEY_D=904
GETKEY_E=905
GETKEY_F=906
GETKEY_G=907
GETKEY_H=908
GETKEY_I=909
GETKEY_J=910
GETKEY_K=911
GETKEY_L=912
GETKEY_M=913
GETKEY_N=914
GETKEY_O=915
GETKEY_P=916
GETKEY_Q=917
GETKEY_R=918
GETKEY_S=919
GETKEY_T=920
GETKEY_U=921
GETKEY_V=922
GETKEY_W=923
GETKEY_X=924
GETKEY_Y=925
GETKEY_Z=926
GETKEY_Enter=941
GETKEY_Shift=942
GETKEY_Ctrl=943
GETKEY_Alt=944
GETKEY_SPACE=945
`

var address = head;
var wordNum = 0

let lines = FILESTRING.trim().split('\n');
			
lines.forEach(line => {
	const [key, value] = line.split('=');
  console.log(`${cmdstring} ${value} ${key}`);
});

lines.forEach(line => {
	const [key, value] = line.split('=');
	let pushname = key + "_PRESS"

	let push = parseInt(value,10)  + 50
	//console.log(`${cmdstring} ${push} ${pushname}`);
	console.log(`${pushname}=${push}`);
});


