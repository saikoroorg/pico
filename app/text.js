const title = "Text"; // Title.
const editjs = "app/edit.js"; // Call script.

const katakana5x5CharSprites = { // Katakana5x5 char sprite table.
	"ァ": picoStringCode6("066912922932942923943924934925"),
	"ア": picoStringCode6("066911921931941951932952933943934925"),
	"ィ": picoStringCode6("066933943914924934935"),
	"イヰ": picoStringCode6("066941951922932913933934935"),
	"ゥ": picoStringCode6("066932913923933943914944935"),
	"ウ": picoStringCode6("066931912922932942952913953944935"),
	"ェ": picoStringCode6("066913923933943934915925935945"),
	"エヱ": picoStringCode6("066912922932942952933934915925935945955"),
	"ォ": picoStringCode6("066932913923933943924934915935"),
	"オ": picoStringCode6("066941912922932942952933943924944915945"),
	"カ": picoStringCode6("066921912922932942952923953924954915945955"),
	"ガ": picoStringCode6("066940960921941961912922932942952923953924954915945955"),
	"キ": picoStringCode6("066931912922932942952933914924934944954935"),
	"ギ": picoStringCode6("066940960931941961912922932942952933914924934944954935"),
	"ク": picoStringCode6("066921931941951922952913953944925935"),
	"グ": picoStringCode6("066940960921931941961922952913953944925935"),
	"ケ": picoStringCode6("066921922932942952913943944925935"),
	"ゲ": picoStringCode6("066940960921941961922932942952913943944925935"),
	"コ": picoStringCode6("066911921931941951952953954915925935945955"),
	"ゴ": picoStringCode6("066940960911921931941961952953954915925935945955"),
	"サ": picoStringCode6("066921941912922932942952923943944935"),
	"ザ": picoStringCode6("066940960921941961912922932942952923943944935"),
	"シ": picoStringCode6("066911921952913923953944925935"),
	"ジ": picoStringCode6("066940960911921941961952913923953944925935"),
	"ス": picoStringCode6("066911921931941951952943934944915925955"),
	"ズ": picoStringCode6("066940960911921931941961952943934944915925955"),
	"セ": picoStringCode6("066921912922932942952923953924935945955"),
	"ゼ": picoStringCode6("066940960921941961912922932942952923953924935945955"),
	"ソ": picoStringCode6("066911951912952923943944935"),
	"ゾ": picoStringCode6("066940960911941961912952923943944935"),
	"タ": picoStringCode6("066921931941951922952913933953944925935"),
	"ダ": picoStringCode6("066940960921931941961922952913933953944925935"),
	"チ": picoStringCode6("066921931941932913923933943953934925"),
	"ヂ": picoStringCode6("066940960921931941961932913923933943953934925"),
	"ッ": picoStringCode6("066913933953954935945"),
	"ツ": picoStringCode6("066911931951912932952953944925935"),
	"ヅ": picoStringCode6("066940960911931941961912932952953944925935"),
	"テ": picoStringCode6("066921931941913923933943953934925"),
	"デ": picoStringCode6("066940960921931941961913923933943953934925"),
	"ト": picoStringCode6("066921922923933943924954925"),
	"ド": picoStringCode6("066940960921941961922923933943924954925"),
	"ナ": picoStringCode6("066931912922932942952933934925"),
	"ニ": picoStringCode6("066922932942915925935945955"),
	"ヌ": picoStringCode6("066911921931941951952923943934944915925955"),
	"ネ": picoStringCode6("066931912922932942952943924934944915935955"),
	"ノ": picoStringCode6("066951952943934915925"),
	"ハ": picoStringCode6("066931942923953914954915955"),
	"バ": picoStringCode6("066940960931941961942923953914954915955"),
	"パ": picoStringCode6("066940950960931941961942952962923953914954915955"),
	"ヒ": picoStringCode6("066911912922932942952913914925935945955"),
	"ビ": picoStringCode6("066940960911941961912922932942952913914925935945955"),
	"ピ": picoStringCode6("066940950960911941961912922932942952962913914925935945955"),
	"フ": picoStringCode6("066911921931941951952953944925935"),
	"ブ": picoStringCode6("066940960911921931941961952953944925935"),
	"プ": picoStringCode6("066940950960911921931941961942952962953944925935"),
	"ヘ": picoStringCode6("066922913933944955"),
	"ベ": picoStringCode6("066940960941961922913933944955"),
	"ペ": picoStringCode6("066940950960941961922942952962913933944955"),
	"ホ": picoStringCode6("066931912922932942952933914934954915935955"),
	"ボ": picoStringCode6("066940960931941961912922932942952933914934954915935955"),
	"ポ": picoStringCode6("066940950960931941961912922932942952962933914934954915935955"),
	"マ": picoStringCode6("066911921931941951952923943934945"),
	"ミ": picoStringCode6("066911921931941923933943925935945955"),
	"ム": picoStringCode6("066931922923943914944915925935955"),
	"メ": picoStringCode6("066941922942933943934954915925"),
	"モ": picoStringCode6("066911921931941922913923933943924935945955"),
	"ャ": picoStringCode6("066922913923933943924944925"),
	"ヤ": picoStringCode6("066921912922932942952923953934935"),
	"ュ": picoStringCode6("066913923933934915925935945"),
	"ユ": picoStringCode6("066921931941942943944915925935945955"),
	"ョ": picoStringCode6("066912922932942913923933943944915925935945"),
	"ヨ": picoStringCode6("066911921931941951952913923933943953954915925935945955"),
	"ラ": picoStringCode6("066921931941913923933943953954935945"),
	"リ": picoStringCode6("066911941912942913943944925935"),
	"ル": picoStringCode6("066921941922942923943924944915945955"),
	"レ": picoStringCode6("066911912913953914944915925935"),
	"ロ": picoStringCode6("066911921931941951912952913953914954915925935945955"),
	"ワヮ": picoStringCode6("066911921931941951912952953944925935"),
	"ヲ": picoStringCode6("066911921931941951952913923933943944925935"),
	"ン": picoStringCode6("066911921951952953944915925935"),
};
const hiragana5x5CharSprites = { // Hiragana5x5 char sprite table.
	"ぁ": picoStringCode6("066912922932942923933914934944915925945"),
	"あ": picoStringCode6("066911921931941922913923933943914924944954915925935955"),
	"ぃ": picoStringCode6("066913943914944925"),
	"いゐ": picoStringCode6("066911912952913953914934954925"),
	"ぅ": picoStringCode6("066922932913923933943944925935"),
	"う": picoStringCode6("066921931941922932942913953954935945"),
	"ぇ": picoStringCode6("066922932913923933943924934915935945"),
	"えゑ": picoStringCode6("066921931912922932942933924934915945955"),
	"ぉ": picoStringCode6("066912922942923914924934944915925945"),
	"お": picoStringCode6("066911921931951922913923933943914934954915925935955"),
	"か": picoStringCode6("066921941912922932952923943914944915945"),
	"が": picoStringCode6("066940960921941961912922932952923943914944915945"),
	"き": picoStringCode6("066931922932942933943953914944925935"),
	"ぎ": picoStringCode6("066940960931941961922932942933943953914944925"),
	"く": picoStringCode6("066941922932913924934945"),
	"ぐ": picoStringCode6("066940960941961922932913924934945"),
	"け": picoStringCode6("066911941912932942952913943914944935"),
	"げ": picoStringCode6("066940960911941961912932942952913943914944935"),
	"こ": picoStringCode6("066921931941942914925935945955"),
	"ご": picoStringCode6("066940960921931941961942914925935945955"),
	"さ": picoStringCode6("066931922932942952943914925935"),
	"ざ": picoStringCode6("066940960931941961922932942952943914925935"),
	"し": picoStringCode6("066921922923924954935945"),
	"じ": picoStringCode6("066940960921941961922923924954935945"),
	"す": picoStringCode6("066941912922932942952923943934944935"),
	"ず": picoStringCode6("066940960941961912922932942952923943934944935"),
	"せ": picoStringCode6("066921941912922932942952923943924935945955"),
	"ぜ": picoStringCode6("066940960921941961912922932942952923943924935945955"),
	"そ": picoStringCode6("066921941922932913923933943953934945"),
	"ぞ": picoStringCode6("066940960921941961922932913923933943953934945"),
	"た": picoStringCode6("066921912922932923943953914915935945955"),
	"だ": picoStringCode6("066940960921941961912922932923943953914915935945955"),
	"ち": picoStringCode6("066921912922932942923933943924954945"),
	"ぢ": picoStringCode6("066940960921941961912922932942923933943924954945"),
	"っ": picoStringCode6("066913923933944925935"),
	"つ": picoStringCode6("066912922932942953954935945"),
	"づ": picoStringCode6("066940960941961912922932942953954935945"),
	"て": picoStringCode6("066911921931941951942933934945955"),
	"で": picoStringCode6("066940960911921931941961942933934945955"),
	"と": picoStringCode6("066911941951922932923914925935945955"),
	"ど": picoStringCode6("066940960911941961922932923914925935945955"),
	"な": picoStringCode6("066921912922932952913943914934944954935945"),
	"に": picoStringCode6("066911931941951912913914934915945955"),
	"ぬ": picoStringCode6("066921941912922932942913933953914924944954945955"),
	"ね": picoStringCode6("066921912922932942923953914924944954925945955"),
	"の": picoStringCode6("066921931941912932952913933953914924954945"),
	"は": picoStringCode6("066911941912932942952913943914934944954915935945"),
	"ば": picoStringCode6("066940960911941961912932942952913943914934944954915935945"),
	"ぱ": picoStringCode6("066940950960911941961912932942952962913943914934944954915935945"),
	"ひ": picoStringCode6("066911921922913943953914944925935"),
	"び": picoStringCode6("066940960911921941961922913943953914944925935"),
	"ぴ": picoStringCode6("066940950960911921941961922942952962913943953914944925935"),
	"ふ": picoStringCode6("066931941913933914934954925935955"),
	"ぶ": picoStringCode6("066940960931941961913933914934954925935955"),
	"ぷ": picoStringCode6("066940950960931941961942952962913933914934954925935955"),
	"へ": picoStringCode6("066922932913943954"),
	"べ": picoStringCode6("066940960941961922932913943954"),
	"ぺ": picoStringCode6("066940950960941961922932942952962913943954"),
	"ほ": picoStringCode6("066911931941951912932942952913943914934944954915935945"),
	"ぼ": picoStringCode6("066930940960911941961912932942952913943914934944954915935945"),
	"ぽ": picoStringCode6("066930940950960911941961912932942952962913943914934944954915935945"),
	"ま": picoStringCode6("066911921931941951912922932942952933914924934944915925935955"),
	"み": picoStringCode6("066911921922942913923933943953914924944945"),
	"む": picoStringCode6("066921941912922932952923914924954915925935945955"),
	"め": picoStringCode6("066921941912922932942913933953914924934954945"),
	"も": picoStringCode6("066921912922932923933914924954925935945"),
	"ゃ": picoStringCode6("066922932913923933943924944925"),
	"や": picoStringCode6("066911931941922952913923943953924935"),
	"ゅ": picoStringCode6("066932913923933943914934944935"),
	"ゆ": picoStringCode6("066921931941912922932952913933953914934944954935"),
	"ょ": picoStringCode6("066932933943914924934915925945"),
	"よ": picoStringCode6("066931932942952933914924934944915925935955"),
	"ら": picoStringCode6("066931941912913923933943914954935945"),
	"り": picoStringCode6("066911941912942913923943944925935"),
	"る": picoStringCode6("066921931941922932913943953924934954925935945"),
	"れ": picoStringCode6("066921912922932942923943914924944925945955"),
	"ろ": picoStringCode6("066921931941932923933943914954935945"),
	"わゎ": picoStringCode6("066921912922932942923953914924954925945"),
	"を": picoStringCode6("066911921931941922913933943924934925935945"),
	"ん": picoStringCode6("066921922913923914934954915935945"),
};
const hiragana5x6CharSprites = { // Hiragana5x6 char sprite table.
	"ぁ": picoStringCode6("066912922932942923933914934944915925945"),
	"あ": picoStringCode6("066920911921931941951922932913923943914934954915925955"),
	"ぃ": picoStringCode6("066913943914944925"),
	"いゐ": picoStringCode6("066910911951912952913953914934954925"),
	"ぅ": picoStringCode6("066922932913923933943944925935"),
	"う": picoStringCode6("066920930922932942913953954935945"),
	"ぇ": picoStringCode6("066922932913923933943924934915935945"),
	"えゑ": picoStringCode6("066920930912922932942933924934915945955"),
	"ぉ": picoStringCode6("066912922942923914924934944915925945"),
	"お": picoStringCode6("066920911921931951922913923933943914934954915925935955"),
	"か": picoStringCode6("066940921941912922932952923943914944915935945"),
	"が": picoStringCode6("066940960921941961912922932952923943914944915935945"),
	"き": picoStringCode6("066940921931941951942933943953914944925"),
	"ぎ": picoStringCode6("066940960921931941961942933943953914944925"),
	"く": picoStringCode6("066941922932913924934945"),
	"ぐ": picoStringCode6("066940960941961922932913924934945"),
	"け": picoStringCode6("066940911941912932942952913943914944935"),
	"げ": picoStringCode6("066940960911941961912932942952913943914944935"),
	"こ": picoStringCode6("066920930940941914925935945955"),
	"ご": picoStringCode6("066920930940960941961914925935945955"),
	"さ": picoStringCode6("066920911921931941951932943914925935945"),
	"ざ": picoStringCode6("066920940960911921931941961932943914925935945"),
	"し": picoStringCode6("066910911912913914954925935945"),
	"じ": picoStringCode6("066910940960911941961912913914954925935945"),
	"す": picoStringCode6("066940911921931941951932942923943934944935"),
	"ず": picoStringCode6("066940960911921931941961932942923943934944935"),
	"せ": picoStringCode6("066920940921941912922932942952923943924935945955"),
	"ぜ": picoStringCode6("066920940960921941961912922932942952923943924935945955"),
	"そ": picoStringCode6("066920940921931912922932942952933924935945"),
	"ぞ": picoStringCode6("066920940960921931941961912922932942952933924935945"),
	"た": picoStringCode6("066920911921931922913933943953914915935945955"),
	"だ": picoStringCode6("066920940960911921931941961922913933943953914915935945955"),
	"ち": picoStringCode6("066920911921931941922923933943924954945"),
	"ぢ": picoStringCode6("066920940960911921931941961922923933943924954945"),
	"っ": picoStringCode6("066913923933944925935"),
	"つ": picoStringCode6("066911921931941952953954935945"),
	"づ": picoStringCode6("066940960911921931941961952953954935945"),
	"て": picoStringCode6("066911921931941951942933934945955"),
	"で": picoStringCode6("066940960911921931941961942933934945955"),
	"と": picoStringCode6("066910921941951922932913914925935945955"),
	"ど": picoStringCode6("066910940960921941961922932913914925935945955"),
	"な": picoStringCode6("066920911921931951922913943914934944954935945"),
	"に": picoStringCode6("066910911931941951912913914934915945955"),
	"ぬ": picoStringCode6("066920940921931941912922942952913933953914924944954945955"),
	"ね": picoStringCode6("066920911921941922932952923953914924944954925945955"),
	"の": picoStringCode6("066921931941912932952913933953914924954945"),
	"は": picoStringCode6("066910940911931941951912942913943914934944954915935945"),
	"ば": picoStringCode6("066910940960911931941961912942913943914934944954915935945"),
	"ぱ": picoStringCode6("066910940950960911931941961912942952962913943914934944954915935945"),
	"ひ": picoStringCode6("066910920921941912942952913943914944925935"),
	"び": picoStringCode6("066910920940960921941961912942952913943914944925935"),
	"ぴ": picoStringCode6("066910920940950960921941961912942952962913943914944925935"),
	"ふ": picoStringCode6("066930941913933914934954925935955"),
	"ぶ": picoStringCode6("066930940960941961913933914934954925935955"),
	"ぷ": picoStringCode6("066930940950960941961942952962913933914934954925935955"),
	"へ": picoStringCode6("066922932913943954"),
	"べ": picoStringCode6("066940960941961922932913943954"),
	"ぺ": picoStringCode6("066940950960941961922932942952962913943954"),
	"ほ": picoStringCode6("066910930940950911941912932942952913943914934944954915935945"),
	"ぼ": picoStringCode6("066910930940960911941961912932942952913943914934944954915935945"),
	"ぽ": picoStringCode6("066910930940950960911941961912932942952962913943914934944954915935945"),
	"ま": picoStringCode6("066910920930940950931912922932942952933914924934944915925935955"),
	"み": picoStringCode6("066910920930931912922932952913933943953914924954945"),
	"む": picoStringCode6("066920940911921931951922913923914924954925935945"),
	"め": picoStringCode6("066920940921931941912922942952913933953914924954945"),
	"も": picoStringCode6("066920911921931922913923933924954925935945"),
	"ゃ": picoStringCode6("066922932913923933943924944925"),
	"や": picoStringCode6("066940911931941922952913923943953924935"),
	"ゅ": picoStringCode6("066932913923933943914934944935"),
	"ゆ": picoStringCode6("066930911931941912922932952913933953914934944954935"),
	"ょ": picoStringCode6("066932933943914924934915925945"),
	"よ": picoStringCode6("066930931941951932913923933914934944915925935955"),
	"ら": picoStringCode6("066930911941912913923933943914954935945"),
	"り": picoStringCode6("066910940911951912922952913953944925935"),
	"る": picoStringCode6("066920930940931922932942913953924934954925935945"),
	"れ": picoStringCode6("066920911921941922932942923943914924944925945955"),
	"ろ": picoStringCode6("066920930940931922932942913953954935945"),
	"わゎ": picoStringCode6("066920911921941922932952923953914924954925945"),
	"を": picoStringCode6("066920911921931941922913933943924934925935945"),
	"ん": picoStringCode6("066920921922913923914934954915935945"),
};
const symbol5x5CharSprites = { // Symbol5x5 char sprite table.
	"ー": picoStringCode6("066913923933943953"),
	"゛": picoStringCode6("066911931912932"),
	"゜": picoStringCode6("066911921931912932913923933"),
	"、": picoStringCode6("066914925"),
	"。": picoStringCode6("066913923933914934915925935"),
	"「": picoStringCode6("066931941951932933"),
	"」": picoStringCode6("066933934915925935"),
	"×": picoStringCode6("066911951922942933924944915955"),
	"△": picoStringCode6("066931922942923943914954915925935945955"),
	"▽": picoStringCode6("066911921931941951912952923943924944935"),
	"○": picoStringCode6("066921931941912952913953914954925935945"),
	"□": picoStringCode6("066911921931941951912952913953914954915925935945955"),
	"▲": picoStringCode6("066931922932942923933943914924934944954915925935945955"),
	"▼": picoStringCode6("066911921931941951912922932942952923933943924934944935"),
	"●": picoStringCode6("066921931941912922932942952913923933943953914924934944954925935945"),
	"■": picoStringCode6("066911921931941951912922932942952913923933943953914924934944954915925935945955"),
};

const extraCharSprites = { // Extra char sprite table.
	"＜": picoStringCode6("066913922923924932933934941942943944945951952953954955"),
	"＞": picoStringCode6("066911912913914915921922923924925932933934942943944953"),
	"｜": picoStringCode6("066931932933934935"),

	"＆": picoStringCode6("066931922932942913923933943953914924934944954925935945"),
	"％": picoStringCode6("066921941912922932942952913923933943953924934944935"),
	"＄": picoStringCode6("066931922932942913923933943953924934944935"),
	"＃": picoStringCode6("066921931941922932942913923933943953914924934944954935"),

	"①": picoStringCode6("066533"),
	"②": picoStringCode6("066415451"),
	"③": picoStringCode6("066633615651"),
	"④": picoStringCode6("066811815851855"),
	"⑤": picoStringCode6("066733711715751755"),
	"⑥": picoStringCode6("066911913915951953955"),

	"△": picoStringCode6("099941932942952923943963944915945975916976917927937947957967977"),
	"＠": picoStringCode6("099900910920930940950960970980901111121131141151161171981902112922132142152962172982903113123133143153163173983904114924134144154964174984905115125135145155165175985906116926136146156966176986907117127137147157167177987908918928938948958968978988"),
};

const extraCharAiliases = [ // Extra char ailiases.
	"0０", "1１", "2２", "3３", "4４", "5５", "6６", "7７", "8８", "9９",
	".．", "-−", "/／", ":：", "+＋", "=＝", "?？", "!！", "*＊",
];

const colors = picoStringCode8("1111113332220i9p060n4f0ir00000");
//const colors = picoStringCode8("1115553332224440i9p060n4f0i000");

const labels = [
	"　いろはにほへと　",
];
for (let i = 1; i < 7; i++) {
	labels[i] = "いろはにほへとー"+i;
}
const figrects = [
	[2, 0,-40, 136,60, 0,1],
];
const figdata = [null];
var figimages = [null];
const figareas = [
	[-1, 0,-40, 136,56, 0,1],
];
const maxfigtext = 17 * 7;
const figtexts = [
	"いろはにほへとちりぬるを、わかよた"+
	"れそつねならむ。うゐのおくやまけふ"+
	"こえて、あさきゆめみしゑひもせす。"+
	"いろばにぼべどぢりぬるを、わがよだ"+
	"れぞづねならむ。うゐのおぐやまげぶ"+
	"ごえで、あざぎゆめみじゑびもぜず。"+
	"ぱぴぷぺぽんぁぃぅぇぉっゃゅょー　",
];
for (let i = 1; i < 7; i++) {
	figtexts[i] = figtexts[0];
}
const figareas4 = [null];
const figtexts4 = [null];
const figareas4b = [null];
const figtexts4b = [null];
for (let i = 1; i < figtexts.length; i++) {
	figrects[i] = figrects[0];
}
for (let i = 1; i < figtexts.length; i++) {
	figareas[i] = figareas[0];
}
const rects = [];
const areas = [
	[-1, 0,48, 136,104, 0,1],
];
const maxtext = 17 * 9;
const texts = [
	"　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　",
];
const items = [];
const builtinChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.-/:+=?!*&%$#";
const allChars = builtinChars +
	Object.keys(katakana5x5CharSprites).join("") +
	Object.keys(hiragana5x5CharSprites).join("") +
	Object.keys(symbol5x5CharSprites).join("");
for (let i = 0; i < 7; i++) {
	texts[i] = "";
	for (let j = 0; j < maxtext; j++) {
		texts[i] += allChars[picoRandom(allChars.length)];
	}
}

// Last page for share.
rects[7] = [2, 0,-40, 136,60, 0,1];
figrects[7] = [0, 0,0, 72,72, 0,1];
figdata[7] = "data:image/svg;base64," + "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAABAKADAAQAAAABAAABAAAAAABEIjhzAAAGUElEQVR4Ae3UwQ0AIAwDscL+OwMPtjgjMUCcKmtmzvseAQJBgR3MLDIBAl/AADgFAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QlcdCIC/6vZJW8AAAAASUVORK5CYII=";
figareas[7] = [-1, 0,0, 88,88, 0,1];
figtexts[7] = 
	"□あ□い□う□え□お□"+
	"□か□き□く□け□こ□"+
	"□さ□し□す□せ□そ□"+
	"□た□ち□つ□て□と□"+
	"□な□に□ぬ□ね□の□"+
	"□は□ひ□ふ□へ□ほ□"+
	"□ま□み□む□め□も□"+
	"□や□■□ゆ□■□よ□"+
	"□ら□り□る□れ□ろ□"+
	"□わ□■□を□■□ん□"+
	"□■□■□＠□■□■□";
figareas4[7] = [-1, 0,0, 88,88, 0,1];
figtexts4[7] = 
	"   1234567.890/0/00   "+
	"                      "+
	"                      "+
	"                      "+
	"                      "+
	"                      "+
	"                      "+
	"                      "+
	"                      "+
	"                      "+
	"   1234567.890/0/00   ";

/*// Additional page for package.
rects[10] = [2, 0,0, 72,144, 0,1];
figrects[10] = [0, 0,0, 72,72, 0,1];
figdata[10] = "data:image/svg;base64," + "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAABAKADAAQAAAABAAABAAAAAABEIjhzAAAGUElEQVR4Ae3UwQ0AIAwDscL+OwMPtjgjMUCcKmtmzvseAQJBgR3MLDIBAl/AADgFAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QkYADdAICxgAMLli07AALgBAmEBAxAuX3QCBsANEAgLGIBw+aITMABugEBYwACEyxedgAFwAwTCAgYgXL7oBAyAGyAQFjAA4fJFJ2AA3ACBsIABCJcvOgED4AYIhAUMQLh80QlcdCIC/6vZJW8AAAAASUVORK5CYII=";
figareas[10] = [-1, 0,-40, 136,56, 0,1];
figtexts[10] = "";
figareas4[10] = [-1, 0,0, 84,128, 0,1];
figtexts4[10] = 
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　い　ろ　は　に　ほ　へ　と　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　　　　　"+
	"　　　　　１２３４５６７．８９０　　　　　";
const livePages = [10,0,1,2,3,4,5,6,7]; // Pages for live.
const dotsStart = 2; // Dots progress bar start index.
const sharePages = [10,10,10,10,10,10,10,10,10,10,10,10]; // Pages for share. (Share live page if null)
const shareWidth = 400, shareHeight = 560; // Page width/height.
const shareVcount = 3; // Vertical count.
/*/


// Menu items for live.
texts[9] =
	"　　　　　　　　　　　　　　　　　"+
	"　　　　　　　つづける　　　　　　"+
	"　　　　　　　　　　　　　　　　　"+
	"　　　　　　　アプリ１　　　　　　"+
	"　　　　　　　　　　　　　　　　　"+
	"　　　　　　　アプリ２　　　　　　"+
	"　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　"+
	"　　　　　　　　　　　　　　　　　";
items[9] = [
	[0,8, 64,16],
	[0,24, 64,16, -1, editjs, ""],
	[0,40, 64,16, -1, editjs, ""],
];

const livePages = [9, 0,1,2,3,4,5,6,7]; // Pages for live.
const dotsStart = 1; // Dots progress bar start index.
const sharePages = [0,1,2,3,4,5,6,7];//null; // Pages for share. (Share live page if null)
const shareWidth = 560, shareHeight = 400; // Page width/height.
const shareVcount = 2; // Vertical count.
//*/

var buttonData = {
	"＞": null,
	"■": figdata[7],
	"△": null,
}; // Button spritedata.

var state = ""; // Playing state.
var number = 0; // Playing page number.
var playing = 0; // Playing count.
var touching = -1; // Touching item index.

// Draw page.
async function appDrawPage(page, cursor=-1, dotsText=null) {
	picoClear();
	picoCharLeading(8,8);
	if (labels[page]) {
		if (cursor >= 0) {
			if (landscape) {
				picoText(labels[page].replaceAll("ー","｜"), -1, -80,0, 8,72, 0,1)
			} else {
				picoText(labels[page], -1, 0,-80, 72,8, 0,1)
			}
		} else {
			picoText(labels[page], -1, 0,-80, 72,8, 0,1)
		}
	}
	if (rects[page]) {
		picoRect(rects[page][0], rects[page][1],rects[page][2], rects[page][3],rects[page][4], rects[page][5],rects[page][6]);
	}
	if (figrects[page]) {
		picoRect(figrects[page][0], figrects[page][1],figrects[page][2], figrects[page][3],figrects[page][4], figrects[page][5],figrects[page][6]);
		if (figimages[page]) {
			picoImage(figimages[page], figrects[page][1],figrects[page][2], figrects[page][5],figrects[page][6]);
		}
		if (figtexts[page]) {
			picoText(figtexts[page], figareas[page][0], figareas[page][1],figareas[page][2], figareas[page][3],figareas[page][4], figareas[page][5],figareas[page][6]);
		}
		if (figtexts4[page]) {
			picoCharLeading(4,6);
			picoText(figtexts4[page], figareas4[page][0], figareas4[page][1],figareas4[page][2], figareas4[page][3],figareas4[page][4], figareas4[page][5],figareas4[page][6]);
			picoCharLeading(8,8);
		}
		if (figtexts4b[page]) {
			picoCharLeading(4,6);
			picoText(figtexts4b[page], figareas4b[page][0], figareas4b[page][1],figareas4b[page][2], figareas4b[page][3],figareas4b[page][4], figareas4b[page][5],figareas4b[page][6]);
			picoCharLeading(8,8);
		}
	}
	if (items[page]) {
		for (let i = 0; i < items[page].length; i++) {
			if (touching < 0 && i == 0) {
				let char = "＞" + "　".repeat(items[page][i][2]/8-1);
				//picoRect(2, items[page][i][0],items[page][i][1], items[page][i][2],items[page][i][3], 0,1);
				picoChar(char, -1, items[page][i][0],items[page][i][1], 0,1);
			} else if (i == touching) {
				let char = "＞" + "　".repeat(items[page][i][2]/8-1);
				picoRect(0, items[page][i][0],items[page][i][1], items[page][i][2],items[page][i][3], 0,1);
				picoChar(char, -1, items[page][i][0],items[page][i][1], 0,1);
			} else {
				//picoRect(2, items[page][i][0],items[page][i][1], items[page][i][2],items[page][i][3], 0,1);
			}
		}
	}
	if (texts[page]) {
		if (cursor >= 0) {
			if (cursor > maxtext) {
				let char = "▼";
				picoText(texts[page].substr(0,maxtext-1)+char, areas[0][0], areas[0][1],areas[0][2], areas[0][3],areas[0][4], areas[0][5],areas[0][6]);
			} else if (cursor < maxtext) {
				let char = (texts[page].charCodeAt(cursor)=="　".charCodeAt(0)?"　":"■");
				picoText(texts[page].substr(0,cursor)+char, areas[0][0], areas[0][1],areas[0][2], areas[0][3],areas[0][4], areas[0][5],areas[0][6]);
			} else {
				picoText(texts[page], areas[0][0], areas[0][1],areas[0][2], areas[0][3],areas[0][4], areas[0][5],areas[0][6]);
			}
			if (dotsText) {
				if (landscape) {
					picoText(dotsText, -1, 80,0, 8,8*dotsText.length, 0,1);
				} else {
					picoText(dotsText, -1, 0,80, 8*dotsText.length,8, 0,1);
				}
			}
		} else {
			picoText(texts[page], areas[0][0], areas[0][1],areas[0][2], areas[0][3],areas[0][4], areas[0][5],areas[0][6]);
		}
	}
}

// Select button.
async function appSelect(x) {

	// Switch demo mode.
	if (state == "demo") {
		state = "";
		//number = 0;
		//playing = 0;
		console.log("Unlock screen.");
		picoLockScreen(false);
		picoLabel("action", null, buttonData["△"]);
		picoLabel("select", null, buttonData["＞"]);
		await picoTitle(title);
	} else {
		state = "demo"; // Demo mode.
		//number = 0;
		//playing = 0;
		console.log("Lock screen.");
		picoLockScreen(true);
		picoLabel("action", null, buttonData["■"]);
		picoLabel("select", null);
		await picoTitle();
	}
}

// Action button.
async function appAction(x) {

	if (!sharePages) { // Share all page as one image.

		// Draw page by file.
		let files = [];
		//for (let i = 0; i < livePages.length; i++) {
			await picoClear();
			await appDrawPage(livePages[number]);
			files[0] = await picoScreenFile();
			await picoFlip();
		//}

		// Share screen.
		picoShare(null, files);

	} else {

		// Draw a page to nearly 5:7(Silveratio) offscreen image.
		const width = shareWidth*shareVcount/sharePages.length, height = shareHeight/shareVcount;
		picoResize(width, height);
		let images = [];
		for (let i = 0; i < sharePages.length; i++) {
			await appDrawPage(sharePages[i]);
			images[i] = await picoScreenImage();
		}

		// Draw all pages to 7:5(Silveratio) offscreen image.
		const hcount = picoDiv(sharePages.length+shareVcount-1,shareVcount); // Horizontal count.
		const voffset = height*(shareVcount-1)/2; // Vertical offset.
		const hoffset = width*(hcount-1)/2; // Horizontal offset.
		picoResize(width*hcount, height*shareVcount); // 560x400 if shareVcount = 2.
		picoClear();
		for (let i = 0; i < sharePages.length; i++) {
			picoImage(images[i],
				picoMod(i,hcount)*width-hoffset,
				picoDiv(i,hcount)*height-voffset);
		}

		// Share screen.
		let file = await picoScreenFile(null, -1, 1);
		picoShare(null, [file]);

		// Restore settings.
		picoResize();
	}
}

// Load.
async function appLoad() {
	await picoTitle(title);
	picoColor(colors);

	for (let chars in katakana5x5CharSprites) {
		picoCharSprite(chars, katakana5x5CharSprites[chars]);
	}
	for (let chars in hiragana5x6CharSprites) {
		picoCharSprite(chars, hiragana5x6CharSprites[chars]);
	}
	for (let chars in symbol5x5CharSprites) {
		picoCharSprite(chars, symbol5x5CharSprites[chars]);
	}
	for (let chars in extraCharSprites) {
		picoCharSprite(chars, extraCharSprites[chars]);
	}
	for (let i = 0; i < extraCharAiliases.length; i++) {
		picoCharSprite(extraCharAiliases[i]);
	}
	picoCharLeading(8,8);

	// Load query params.
	let value = picoString("k");
	if (value) {
		state = "demo"; // Demo mode.
		console.log("Lock screen.");
		picoLockScreen(true);
	}

	// Load image.
	for (let j = 0; j < figdata.length; j++) {
		if (figdata[j]) {
			figimages[j] = await picoLoad(figdata[j]);
		}
	}
	//buttonData["■"] = await picoSpriteData(symbol5x5CharSprites["■"], -1);
	buttonData["＞"] = await picoSpriteData(extraCharSprites["＞"], -1);
	buttonData["△"] = await picoSpriteData(extraCharSprites["△"], -1);

	// Initialize buttons.
	picoLabel("action", null, state=="demo"?buttonData["■"]:buttonData["△"]);
	picoLabel("select", null, state=="demo"?null:buttonData["＞"]);
	await picoTitle(state=="demo"?null:title);
	appResize(); // Initialize positions.
}

var landscape = false; // landscape mode.

// Resize.
async function appResize() {
	landscape = picoWideScreen();
	picoFlush();
}

// Main.
async function appMain() {

	// Demo mode.
	if (state == "demo") {
		await picoWait(100);
		let pressing = 0, page = livePages[number];
		if (picoMotion()) {
		//if (picoAction(areas[0][1],areas[0][2], areas[0][3]/2,areas[0][4]/2)) {
			state = "";
			console.log("Unlock screen.");
			picoLabel("action", null, buttonData["△"]);
			picoLabel("select", null, buttonData["＞"]);
			await picoTitle(title);
			picoLockScreen(false);
		//} else if (picoMotion(areas[0][1],areas[0][2], areas[0][3]/2,areas[0][4]/2)) {
		//	pressing = 1;
		} else {
			if (items[page] || !texts[page] || playing >= picoDiv(texts[page].length,10)*10 + 20) {
				number = number + 1 < livePages.length ? number + 1: 0;
				playing = 0;
			} else {
				playing += 1;
			}
		}
		let cursorChar = pressing?"■":!picoMod(playing/5,2)?"＞":"　";
		let dotsText = number>=dotsStart?"□".repeat(number-dotsStart)+cursorChar+"□".repeat(livePages.length-number-1):null;
		appDrawPage(livePages[number], playing<maxtext-1?playing:maxtext, dotsText);
		picoFlush();

	// Live mode.
	} else {
		let pressing = 0, page = livePages[number], cursorChar = "■";
		let dotsText = number>=dotsStart?"□".repeat(number-dotsStart)+cursorChar+"□".repeat(livePages.length-number-1):null;
		if (items[page]) {
			appDrawPage(livePages[number], maxtext, dotsText);
			if (picoAction()) {
				if (touching >= 0) {
					if (items[page][touching][4] >= 0) {
						number = items[page][touching][4] < livePages.length ? items[page][touching][4]: 0;
					} else if (items[page][touching][5]) {
						picoResetParams();
						if (items[page][touching][6]) {
							picoSetString(items[page][touching][7]);
						}
						picoSwitchApp(items[page][touching][5]);
					} else {
						number = number + 1 < livePages.length ? number + 1: 0;
					}
				}
				touching = -1;
				playing = 0;
				picoFlush();
			} else {
				touching = -1;
				for (let i = 1; i < items[page].length; i++) {
					if (picoMotion(items[page][i][0],items[page][i][1], items[page][i][2]/2,items[page][i][3]/2)) {
						touching = i;
						break;
					}
				}
				if (touching < 0 && picoMotion(areas[0][1],areas[0][2], areas[0][3]/2,areas[0][4]/2)) {
					touching = 0;
				}
			}
		} else {
			if (!texts[page] || playing >= texts[page].length) {
				appDrawPage(livePages[number], maxtext+1, dotsText);
				if (picoAction(areas[0][1],areas[0][2], areas[0][3]/2,areas[0][4]/2)) {
					number = number + 1 < livePages.length ? number + 1: 0;
					playing = 0;
					picoFlush();
				} else if (picoMotion()) {
					pressing = 1;
				}
			} else {
				if (picoMotion(areas[0][1],areas[0][2], areas[0][3]/2,areas[0][4]/2)) {
					if (texts[page] && playing + 10 < texts[page].length - 1) {
						playing += 10;
					} else {
						playing = texts[page].length - 1;
					}
					pressing = 1;
				} else {
					playing += 0.5;
				}
				appDrawPage(livePages[number], playing<maxtext-1?playing:pressing?maxtext:maxtext+1, dotsText);
				picoFlush();
			}
		}
	}
}
