const title = "Text"; // Title.

const katakana5x5CharSprites = { // Katakana5x5 char sprite table.
	"ァ": picoStringCode6("077912922932942923943924934925"),
	"ア": picoStringCode6("077911921931941951932952933943934925"),
	"ィ": picoStringCode6("077933943914924934935"),
	"イヰ": picoStringCode6("077941951922932913933934935"),
	"ゥ": picoStringCode6("077932913923933943914944935"),
	"ウ": picoStringCode6("077931912922932942952913953944935"),
	"ェ": picoStringCode6("077913923933943934915925935945"),
	"エヱ": picoStringCode6("077912922932942952933934915925935945955"),
	"ォ": picoStringCode6("077932913923933943924934915935"),
	"オ": picoStringCode6("077941912922932942952933943924944915945"),
	"カ": picoStringCode6("077921912922932942952923953924954915945955"),
	"ガ": picoStringCode6("077940960921941961912922932942952923953924954915945955"),
	"キ": picoStringCode6("077931912922932942952933914924934944954935"),
	"ギ": picoStringCode6("077940960931941961912922932942952933914924934944954935"),
	"ク": picoStringCode6("077921931941951922952913953944925935"),
	"グ": picoStringCode6("077940960921931941961922952913953944925935"),
	"ケ": picoStringCode6("077921922932942952913943944925935"),
	"ゲ": picoStringCode6("077940960921941961922932942952913943944925935"),
	"コ": picoStringCode6("077911921931941951952953954915925935945955"),
	"ゴ": picoStringCode6("077940960911921931941961952953954915925935945955"),
	"サ": picoStringCode6("077921941912922932942952923943944935"),
	"ザ": picoStringCode6("077940960921941961912922932942952923943944935"),
	"シ": picoStringCode6("077911921952913923953944925935"),
	"ジ": picoStringCode6("077940960911921941961952913923953944925935"),
	"ス": picoStringCode6("077911921931941951952943934944915925955"),
	"ズ": picoStringCode6("077940960911921931941961952943934944915925955"),
	"セ": picoStringCode6("077921912922932942952923953924935945955"),
	"ゼ": picoStringCode6("077940960921941961912922932942952923953924935945955"),
	"ソ": picoStringCode6("077911951912952923943944935"),
	"ゾ": picoStringCode6("077940960911941961912952923943944935"),
	"タ": picoStringCode6("077921931941951922952913933953944925935"),
	"ダ": picoStringCode6("077940960921931941961922952913933953944925935"),
	"チ": picoStringCode6("077921931941932913923933943953934925"),
	"ヂ": picoStringCode6("077940960921931941961932913923933943953934925"),
	"ッ": picoStringCode6("077913933953954935945"),
	"ツ": picoStringCode6("077911931951912932952953944925935"),
	"ヅ": picoStringCode6("077940960911931941961912932952953944925935"),
	"テ": picoStringCode6("077921931941913923933943953934925"),
	"デ": picoStringCode6("077940960921931941961913923933943953934925"),
	"ト": picoStringCode6("077921922923933943924954925"),
	"ド": picoStringCode6("077940960921941961922923933943924954925"),
	"ナ": picoStringCode6("077931912922932942952933934925"),
	"ニ": picoStringCode6("077922932942915925935945955"),
	"ヌ": picoStringCode6("077911921931941951952923943934944915925955"),
	"ネ": picoStringCode6("077931912922932942952943924934944915935955"),
	"ノ": picoStringCode6("077951952943934915925"),
	"ハ": picoStringCode6("077931942923953914954915955"),
	"バ": picoStringCode6("077940960931941961942923953914954915955"),
	"パ": picoStringCode6("077940950960931941961942952962923953914954915955"),
	"ヒ": picoStringCode6("077911912922932942952913914925935945955"),
	"ビ": picoStringCode6("077940960911941961912922932942952913914925935945955"),
	"ピ": picoStringCode6("077940950960911941961912922932942952962913914925935945955"),
	"フ": picoStringCode6("077911921931941951952953944925935"),
	"ブ": picoStringCode6("077940960911921931941961952953944925935"),
	"プ": picoStringCode6("077940950960911921931941961942952962953944925935"),
	"ヘ": picoStringCode6("077922913933944955"),
	"ベ": picoStringCode6("077940960941961922913933944955"),
	"ペ": picoStringCode6("077940950960941961922942952962913933944955"),
	"ホ": picoStringCode6("077931912922932942952933914934954915935955"),
	"ボ": picoStringCode6("077940960931941961912922932942952933914934954915935955"),
	"ポ": picoStringCode6("077940950960931941961912922932942952962933914934954915935955"),
	"マ": picoStringCode6("077911921931941951952923943934945"),
	"ミ": picoStringCode6("077911921931941923933943925935945955"),
	"ム": picoStringCode6("077931922923943914944915925935955"),
	"メ": picoStringCode6("077941922942933943934954915925"),
	"モ": picoStringCode6("077911921931941922913923933943924935945955"),
	"ャ": picoStringCode6("077922913923933943924944925"),
	"ヤ": picoStringCode6("077921912922932942952923953934935"),
	"ュ": picoStringCode6("077913923933934915925935945"),
	"ユ": picoStringCode6("077921931941942943944915925935945955"),
	"ョ": picoStringCode6("077912922932942913923933943944915925935945"),
	"ヨ": picoStringCode6("077911921931941951952913923933943953954915925935945955"),
	"ラ": picoStringCode6("077921931941913923933943953954935945"),
	"リ": picoStringCode6("077911941912942913943944925935"),
	"ル": picoStringCode6("077921941922942923943924944915945955"),
	"レ": picoStringCode6("077911912913953914944915925935"),
	"ロ": picoStringCode6("077911921931941951912952913953914954915925935945955"),
	"ワヮ": picoStringCode6("077911921931941951912952953944925935"),
	"ヲ": picoStringCode6("077911921931941951952913923933943944925935"),
	"ン": picoStringCode6("077911921951952953944915925935"),
};
const hiragana5x5CharSprites = { // Hiragana5x5 char sprite table.
	"ぁ": picoStringCode6("077912922932942923933914934944915925945"),
	"あ": picoStringCode6("077911921931941922913923933943914924944954915925935955"),
	"ぃ": picoStringCode6("077913943914944925"),
	"いゐ": picoStringCode6("077911912952913953914934954925"),
	"ぅ": picoStringCode6("077922932913923933943944925935"),
	"う": picoStringCode6("077921931941922932942913953954935945"),
	"ぇ": picoStringCode6("077922932913923933943924934915935945"),
	"えゑ": picoStringCode6("077921931912922932942933924934915945955"),
	"ぉ": picoStringCode6("077912922942923914924934944915925945"),
	"お": picoStringCode6("077911921931951922913923933943914934954915925935955"),
	"か": picoStringCode6("077921941912922932952923943914944915945"),
	"が": picoStringCode6("077940960921941961912922932952923943914944915945"),
	"き": picoStringCode6("077931922932942933943953914944925935"),
	"ぎ": picoStringCode6("077940960931941961922932942933943953914944925"),
	"く": picoStringCode6("077941922932913924934945"),
	"ぐ": picoStringCode6("077940960941961922932913924934945"),
	"け": picoStringCode6("077911941912932942952913943914944935"),
	"げ": picoStringCode6("077940960911941961912932942952913943914944935"),
	"こ": picoStringCode6("077921931941942914925935945955"),
	"ご": picoStringCode6("077940960921931941961942914925935945955"),
	"さ": picoStringCode6("077931922932942952943914925935"),
	"ざ": picoStringCode6("077940960931941961922932942952943914925935"),
	"し": picoStringCode6("077921922923924954935945"),
	"じ": picoStringCode6("077940960921941961922923924954935945"),
	"す": picoStringCode6("077941912922932942952923943934944935"),
	"ず": picoStringCode6("077940960941961912922932942952923943934944935"),
	"せ": picoStringCode6("077921941912922932942952923943924935945955"),
	"ぜ": picoStringCode6("077940960921941961912922932942952923943924935945955"),
	"そ": picoStringCode6("077921941922932913923933943953934945"),
	"ぞ": picoStringCode6("077940960921941961922932913923933943953934945"),
	"た": picoStringCode6("077921912922932923943953914915935945955"),
	"だ": picoStringCode6("077940960921941961912922932923943953914915935945955"),
	"ち": picoStringCode6("077921912922932942923933943924954945"),
	"ぢ": picoStringCode6("077940960921941961912922932942923933943924954945"),
	"っ": picoStringCode6("077913923933944925935"),
	"つ": picoStringCode6("077912922932942953954935945"),
	"づ": picoStringCode6("077940960941961912922932942953954935945"),
	"て": picoStringCode6("077911921931941951942933934945955"),
	"で": picoStringCode6("077940960911921931941961942933934945955"),
	"と": picoStringCode6("077911941951922932923914925935945955"),
	"ど": picoStringCode6("077940960911941961922932923914925935945955"),
	"な": picoStringCode6("077921912922932952913943914934944954935945"),
	"に": picoStringCode6("077911931941951912913914934915945955"),
	"ぬ": picoStringCode6("077921941912922932942913933953914924944954945955"),
	"ね": picoStringCode6("077921912922932942923953914924944954925945955"),
	"の": picoStringCode6("077921931941912932952913933953914924954945"),
	"は": picoStringCode6("077911941912932942952913943914934944954915935945"),
	"ば": picoStringCode6("077940960911941961912932942952913943914934944954915935945"),
	"ぱ": picoStringCode6("077940950960911941961912932942952962913943914934944954915935945"),
	"ひ": picoStringCode6("077911921922913943953914944925935"),
	"び": picoStringCode6("077940960911921941961922913943953914944925935"),
	"ぴ": picoStringCode6("077940950960911921941961922942952962913943953914944925935"),
	"ふ": picoStringCode6("077931941913933914934954925935955"),
	"ぶ": picoStringCode6("077940960931941961913933914934954925935955"),
	"ぷ": picoStringCode6("077940950960931941961942952962913933914934954925935955"),
	"へ": picoStringCode6("077922932913943954"),
	"べ": picoStringCode6("077940960941961922932913943954"),
	"ぺ": picoStringCode6("077940950960941961922932942952962913943954"),
	"ほ": picoStringCode6("077911931941951912932942952913943914934944954915935945"),
	"ぼ": picoStringCode6("077930940960911941961912932942952913943914934944954915935945"),
	"ぽ": picoStringCode6("077930940950960911941961912932942952962913943914934944954915935945"),
	"ま": picoStringCode6("077911921931941951912922932942952933914924934944915925935955"),
	"み": picoStringCode6("077911921922942913923933943953914924944945"),
	"む": picoStringCode6("077921941912922932952923914924954915925935945955"),
	"め": picoStringCode6("077921941912922932942913933953914924934954945"),
	"も": picoStringCode6("077921912922932923933914924954925935945"),
	"ゃ": picoStringCode6("077922932913923933943924944925"),
	"や": picoStringCode6("077911931941922952913923943953924935"),
	"ゅ": picoStringCode6("077932913923933943914934944935"),
	"ゆ": picoStringCode6("077921931941912922932952913933953914934944954935"),
	"ょ": picoStringCode6("077932933943914924934915925945"),
	"よ": picoStringCode6("077931932942952933914924934944915925935955"),
	"ら": picoStringCode6("077931941912913923933943914954935945"),
	"り": picoStringCode6("077911941912942913923943944925935"),
	"る": picoStringCode6("077921931941922932913943953924934954925935945"),
	"れ": picoStringCode6("077921912922932942923943914924944925945955"),
	"ろ": picoStringCode6("077921931941932923933943914954935945"),
	"わゎ": picoStringCode6("077921912922932942923953914924954925945"),
	"を": picoStringCode6("077911921931941922913933943924934925935945"),
	"ん": picoStringCode6("077921922913923914934954915935945"),
};
const hiragana5x6CharSprites = { // Hiragana5x6 char sprite table.
	"ぁ": picoStringCode6("077912922932942923933914934944915925945"),
	"あ": picoStringCode6("077920911921931941951922932913923943914934954915925955"),
	"ぃ": picoStringCode6("077913943914944925"),
	"いゐ": picoStringCode6("077910911951912952913953914934954925"),
	"ぅ": picoStringCode6("077922932913923933943944925935"),
	"う": picoStringCode6("077920930922932942913953954935945"),
	"ぇ": picoStringCode6("077922932913923933943924934915935945"),
	"えゑ": picoStringCode6("077920930912922932942933924934915945955"),
	"ぉ": picoStringCode6("077912922942923914924934944915925945"),
	"お": picoStringCode6("077920911921931951922913923933943914934954915925935955"),
	"か": picoStringCode6("077940921941912922932952923943914944915935945"),
	"が": picoStringCode6("077940960921941961912922932952923943914944915935945"),
	"き": picoStringCode6("077940921931941951942933943953914944925"),
	"ぎ": picoStringCode6("077940960921931941961942933943953914944925"),
	"く": picoStringCode6("077941922932913924934945"),
	"ぐ": picoStringCode6("077940960941961922932913924934945"),
	"け": picoStringCode6("077940911941912932942952913943914944935"),
	"げ": picoStringCode6("077940960911941961912932942952913943914944935"),
	"こ": picoStringCode6("077920930940941914925935945955"),
	"ご": picoStringCode6("077920930940960941961914925935945955"),
	"さ": picoStringCode6("077920911921931941951932943914925935945"),
	"ざ": picoStringCode6("077920940960911921931941961932943914925935945"),
	"し": picoStringCode6("077910911912913914954925935945"),
	"じ": picoStringCode6("077910940960911941961912913914954925935945"),
	"す": picoStringCode6("077940911921931941951932942923943934944935"),
	"ず": picoStringCode6("077940960911921931941961932942923943934944935"),
	"せ": picoStringCode6("077920940921941912922932942952923943924935945955"),
	"ぜ": picoStringCode6("077920940960921941961912922932942952923943924935945955"),
	"そ": picoStringCode6("077920940921931912922932942952933924935945"),
	"ぞ": picoStringCode6("077920940960921931941961912922932942952933924935945"),
	"た": picoStringCode6("077920911921931922913933943953914915935945955"),
	"だ": picoStringCode6("077920940960911921931941961922913933943953914915935945955"),
	"ち": picoStringCode6("077920911921931941922923933943924954945"),
	"ぢ": picoStringCode6("077920940960911921931941961922923933943924954945"),
	"っ": picoStringCode6("077913923933944925935"),
	"つ": picoStringCode6("077911921931941952953954935945"),
	"づ": picoStringCode6("077940960911921931941961952953954935945"),
	"て": picoStringCode6("077911921931941951942933934945955"),
	"で": picoStringCode6("077940960911921931941961942933934945955"),
	"と": picoStringCode6("077910921941951922932913914925935945955"),
	"ど": picoStringCode6("077910940960921941961922932913914925935945955"),
	"な": picoStringCode6("077920911921931951922913943914934944954935945"),
	"に": picoStringCode6("077910911931941951912913914934915945955"),
	"ぬ": picoStringCode6("077920940921931941912922942952913933953914924944954945955"),
	"ね": picoStringCode6("077920911921941922932952923953914924944954925945955"),
	"の": picoStringCode6("077921931941912932952913933953914924954945"),
	"は": picoStringCode6("077910940911931941951912942913943914934944954915935945"),
	"ば": picoStringCode6("077910940960911931941961912942913943914934944954915935945"),
	"ぱ": picoStringCode6("077910940950960911931941961912942952962913943914934944954915935945"),
	"ひ": picoStringCode6("077910920921941912942952913943914944925935"),
	"び": picoStringCode6("077910920940960921941961912942952913943914944925935"),
	"ぴ": picoStringCode6("077910920940950960921941961912942952962913943914944925935"),
	"ふ": picoStringCode6("077930941913933914934954925935955"),
	"ぶ": picoStringCode6("077930940960941961913933914934954925935955"),
	"ぷ": picoStringCode6("077930940950960941961942952962913933914934954925935955"),
	"へ": picoStringCode6("077922932913943954"),
	"べ": picoStringCode6("077940960941961922932913943954"),
	"ぺ": picoStringCode6("077940950960941961922932942952962913943954"),
	"ほ": picoStringCode6("077910930940950911941912932942952913943914934944954915935945"),
	"ぼ": picoStringCode6("077910930940960911941961912932942952913943914934944954915935945"),
	"ぽ": picoStringCode6("077910930940950960911941961912932942952962913943914934944954915935945"),
	"ま": picoStringCode6("077910920930940950931912922932942952933914924934944915925935955"),
	"み": picoStringCode6("077910920930931912922932952913933943953914924954945"),
	"む": picoStringCode6("077920940911921931951922913923914924954925935945"),
	"め": picoStringCode6("077920940921931941912922942952913933953914924954945"),
	"も": picoStringCode6("077920911921931922913923933924954925935945"),
	"ゃ": picoStringCode6("077922932913923933943924944925"),
	"や": picoStringCode6("077940911931941922952913923943953924935"),
	"ゅ": picoStringCode6("077932913923933943914934944935"),
	"ゆ": picoStringCode6("077930911931941912922932952913933953914934944954935"),
	"ょ": picoStringCode6("077932933943914924934915925945"),
	"よ": picoStringCode6("077930931941951932913923933914934944915925935955"),
	"ら": picoStringCode6("077930911941912913923933943914954935945"),
	"り": picoStringCode6("077910940911951912922952913953944925935"),
	"る": picoStringCode6("077920930940931922932942913953924934954925935945"),
	"れ": picoStringCode6("077920911921941922932942923943914924944925945955"),
	"ろ": picoStringCode6("077920930940931922932942913953954935945"),
	"わゎ": picoStringCode6("077920911921941922932952923953914924954925945"),
	"を": picoStringCode6("077920911921931941922913933943924934925935945"),
	"ん": picoStringCode6("077920921922913923914934954915935945"),
};
const symbol5x5CharSprites = { // Symbol5x5 char sprite table.
	"ー": picoStringCode6("077913923933943953"),
	"゛": picoStringCode6("077911931912932"),
	"゜": picoStringCode6("077911921931912932913923933"),
	"、": picoStringCode6("077914925"),
	"。": picoStringCode6("077913923933914934915925935"),
	"「": picoStringCode6("077931941951932933"),
	"」": picoStringCode6("077933934915925935"),
	"×": picoStringCode6("077911951922942933924944915955"),
	"○": picoStringCode6("077921931941912952913953914954925935945"),
	"△": picoStringCode6("077931922942923943914954915925935945955"),
	"□": picoStringCode6("077911921931941951912952913953914954915925935945955"),
	"●": picoStringCode6("077921931941912922932942952913923933943953914924934944954925935945"),
	"■": picoStringCode6("077911921931941951912922932942952913923933943953914924934944954915925935945955"),
	"＆": picoStringCode6("077931922932942913923933943953914924934944954925935945"),
	"％": picoStringCode6("077921941912922932942952913923933943953924934944935"),
	"＄": picoStringCode6("077931922932942913923933943953924934944935"),
	"＃": picoStringCode6("077921931941922932942913923933943953914924934944954935"),
};

const extraCharSprites = { // Extra char sprite table.
	"▼": picoStringCode6("077911921931941951912922932942952923933943924934944935"),
/*
	"▽": picoStringCode6("077911951912952923943924944935"),
	"＜": picoStringCode6("077941951922932913924934945955"),
	"＞": picoStringCode6("077911921932942953934944915925"),
	"→": picoStringCode6("077931942913923933943953944935"),
	"◉": picoStringCode6("099900910920930940950960970980901911921931941951961971981902912932942952972982903913923933943953963973983904914924934944964974984905915935955975985906916926966976986907917927937947957967977987908918928938948958968978988"), //[0,7,7,9,1,0,9,2,0,9,3,0,9,4,0,9,5,0,9,1,1,9,3,1,9,5,1,9,1,2,9,2,2,9,3,2,9,4,2,9,5,2,9,2,4,9,4,4,9,1,5,9,3,5,9,5,5],
	"◎": picoStringCode6("099900910920930940950960970980901921931941951961981902922942962982903923933943953963983904984905935955985906926946966986907987908918928938948958968978988"), //[0,7,7,9,0,0,9,1,0,9,2,0,9,3,0,9,4,0,9,5,0,9,6,0,9,0,1,9,2,1,9,3,1,9,4,1,9,6,1,9,0,2,9,1,2,9,2,2,9,3,2,9,4,2,9,5,2,9,6,2,9,0,3,9,1,3,9,2,3,9,3,3,9,5,3,9,6,3,9,0,4,9,2,4,9,4,4,9,6,4,9,0,5,9,1,5,9,5,5,9,6,5,9,0,6,9,1,6,9,2,6,9,3,6,9,4,6,9,5,6,9,6,6],
*/
};

const extraCharAiliases = [ // Extra char ailiases.
	"0０", "1１", "2２", "3３", "4４", "5５", "6６", "7７", "8８", "9９", "-−", "+＋", "/／", ":：", "?？",
];

const maxstate = 6;
const labels = {
	0:"　　　　　　いろはにほへと　　　　　　",
};
for (let i = 1; i <= maxstate; i++) {
	labels[i] = labels[0];
}
const maxfig = 17 * 7;
const figs = {
	0:"いろはにほへとちりぬるを、わかよた"+
	  "れそつねならむ。うゐのおくやまけふ"+
	  "こえて、あさきゆめみしゑひもせす。"+
	  "いろばにぼべどぢりぬるを、わがよだ"+
	  "れぞづねならむ。うゐのおぐやまげぶ"+
	  "ごえで、あざぎゆめみじゑびもぜず。"+
	  "ぱぴぷぺぽんぁぃぅぇぉっゃゅょー　",
};
for (let i = 1; i <= maxstate; i++) {
	figs[i] = figs[0];
}
const maxtext = 19 * 12;
const texts = {
	0:"□□□□□□□□□□□□□□□□□□□"+
		"□□□□□□□□□□□□□□□□□□□"+
		"□□□□□□□□□□□□□□□□□□□"+
		"□□□□□□□□□□□□□□□□□□□"+
		"□□□□□□□□□□□□□□□□□□□"+
		"□□□□□□□□□□□□□□□□□□□"+
		"□□□□□□□□□□□□□□□□□□□"+
		"□□□□□□□□□□□□□□□□□□□"+
		"□□□□□□□□□□□□□□□□□□□"+
		"□□□□□□□□□□□□□□□□□□□"+
		"□□□□□□□□□□□□□□□□□□□"+
		"□□□□□□□□□□□□□□□□□□▼",
};
const dots = {
	0:"　　　　　　■□□□□□□　　　　　　",
	1:"　　　　　　□■□□□□□　　　　　　",
	2:"　　　　　　□□■□□□□　　　　　　",
	3:"　　　　　　□□□■□□□　　　　　　",
	4:"　　　　　　□□□□■□□　　　　　　",
	5:"　　　　　　□□□□□■□　　　　　　",
	6:"　　　　　　□□□□□□■　　　　　　",
};
const allChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.-/:+=?*&%$#" +
	Object.keys(katakana5x5CharSprites).join("") + 
	Object.keys(hiragana5x5CharSprites).join("") + 
	Object.keys(symbol5x5CharSprites).join("");
for (let i = 0; i <= maxstate; i++) {
	texts[i] = "";
	for (let j = 0; j < maxtext - 1; j++) {
		texts[i] += i > 0 ? allChars[picoRandom(allChars.length)] : j < allChars.length ? allChars[j] : " ";
	}
	texts[i] += "▼";
}

var state = 0; // Playing state.
var playing = 0; // Playing count.

// Action button.
async function appAction() {
	let files = [];
	for (let i = 0; i <= maxstate; i++) {
		await picoClear();
		await picoCharLeading(8,8);
		await picoText(labels[i], -1, 0,-92, 152,8, 0,1)
		await picoRect(2, 0,-52, 144,64, 0,1);
		await picoText(figs[i], -1, 0,-52, 136,56, 0,1);
		await picoText(texts[i].substr(0,maxtext-1), -1, 0,32, 152,96, 0,1);
		await picoFlip();
		await picoFlip(10); //@todo use lock mechanism.
		await picoCharLeading(4,6);
		files[i] = await picoScreenFile(pico.app.author, 0, -1, "image"+i+".png");
		await picoWait(100); //@todo use lock mechanism.
	}
	await picoShare(null, files);
	await picoCharLeading(8,8);

	// Restart.
	state = 0;
	playing = 0;
}

// Load.
async function appLoad() {
	await picoTitle(title);

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

	picoLabel("action", "&");
}

// Main.
async function appMain() {
	let pressing = 0;
	if (playing >= texts[state].length) {
		if (picoAction()) {
			state = state + 1 <= maxstate ? state + 1: 0;

			// Switch hiragana char sprites.
			if (!picoMod(state, 2)) {
				for (let chars in hiragana5x6CharSprites) {
					picoCharSprite(chars, hiragana5x6CharSprites[chars]);
				}
			} else {
				for (let chars in hiragana5x5CharSprites) {
					picoCharSprite(chars, hiragana5x5CharSprites[chars]);
				}
			}

			playing = 0;
			picoFlush();
		} else if (picoMotion()) {
			pressing = 1;
		}
	} else {
		if (picoMotion()) {
			if (playing + 10 < texts[state].length - 1) {
				playing = playing + 10;
			} else {
				playing = texts[state].length - 1;
			}
		} else {
			playing += 1;
		}
		picoFlush();
	}

	picoClear();
	picoText(labels[state], -1, 0,-92, 152,8, 0,1)
	picoRect(2, 0,-52, 144,64, 0,1);
	picoText(figs[state], -1, 0,-52, 136,56, 0,1);
	picoText(texts[state].substr(0,pressing?maxtext-1:playing), -1, 0,32, 152,96, 0,1);
	picoText(dots[state], -1, 0,92, 152,8, 0,1)
}
