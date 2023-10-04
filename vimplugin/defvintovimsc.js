// set here
const m = 100; // 任意の回数を設定します
const head = 3000
const WORD = "strAr"

var address = head;
var wordNum = 0

for (let i = 0; i < m; i++) {
  console.log(`${WORD}${wordNum} = ${address}`);
	address++
	wordNum++;
}
