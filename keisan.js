//***********************************************************
//相続税の計算
//***********************************************************

//===========================================================
// グローバル変数宣言
//===========================================================

var PartnerExists; // 配偶者の有無(int)
var Others; // 配偶者以外の相続人の種類
var NumPerson; // 配偶者以外の相続人の数(int)

// 速算表マトリクス（２次元配列）
var Matrix;

// マトリクス添え字
var VALUES = 0; // 取得金額
var RATE   = 1; // 税率
var EXCEPT = 2; // 控除額
var NumWariai = 50;


//===========================================================
// 初期化
//===========================================================

function init()
{
//---------------------------
// グローバル変数の初期化

PartnerExists = 1; // 配偶者あり
Others = 0; // 子
NumPerson = 0; // １人

//---------------------------
// 配列の生成
//
// Matrix[VALUES][n] 相続分による取得金額（1000千円）
// Matrix[RATE][n]    税率（％）
// Matrix[EXCEPT][n]  控除額（千円）

Matrix = new Array(3);
for ( i = 0; i < 3; i++ ) {
Matrix[i] = new Array(8);
}

//---------------------------
// 速算表マトリクスの初期化
//
// 但し最大値はプログラム中で処理

// 取得金額
Matrix[VALUES][0] = 1000;
Matrix[VALUES][1] = 3000;
Matrix[VALUES][2] = 5000;
Matrix[VALUES][3] = 10000;
Matrix[VALUES][4] = 20000;
Matrix[VALUES][5] = 30000;
Matrix[VALUES][6] = 60000;
Matrix[VALUES][7] = 999999999;

// 税率（％）
Matrix[RATE][0] = 10;
Matrix[RATE][1] = 15;
Matrix[RATE][2] = 20;
Matrix[RATE][3] = 30;
Matrix[RATE][4] = 40;
Matrix[RATE][5] = 45;
Matrix[RATE][6] = 50;
Matrix[RATE][7] = 55;

// 控除額
Matrix[EXCEPT][0] = 0;
Matrix[EXCEPT][1] = 50;
Matrix[EXCEPT][2] = 200;
Matrix[EXCEPT][3] = 700;
Matrix[EXCEPT][4] = 1700;
Matrix[EXCEPT][5] = 2700;
Matrix[EXCEPT][6] = 4200;
Matrix[EXCEPT][7] = 7200;



//---------------------------
// テキストフォームの初期化

document.MAIN.REALESTATE.value = 0;
document.MAIN.CASHSAVING.value = 0;
document.MAIN.SECURITIES.value = 0;
document.MAIN.INSURANCE.value = 0;
document.MAIN.OTHERMONEY.value = 0;
document.MAIN.OWING.value = 0;
//document.MAIN.TOTALINHERIT.value = 0;
document.MAIN.TOTALTAX.value = 0;
document.MAIN.WARIAI.value = 50;
}

//===========================================================
// イベントハンドラ
//===========================================================

//-----------------------------
// 配偶者の有無
//-----------------------------
// radio オブジェクト
function setPartnerExists(
radioObj
)
{
if ( radioObj.value == "1" ) {
PartnerExists = 1;
} else {
PartnerExists = 0;
}
}

//-----------------------------
// 配偶者以外の相続人
//-----------------------------
function setOthers(
radioObj// radio オブジェクト
)
{
Others = parseInt(radioObj.value);
}

//-----------------------------
// 配偶者以外の相続人の数
//-----------------------------
function setNumPerson(
radioObj// radio オブジェクト
)
{
NumPerson = parseInt(radioObj.value);
}

//-----------------------------
// 配偶者の分配割合
//-----------------------------
function setNumWariai(
radioObj// radio オブジェクト
)
{
NumWariai = parseInt(radioObj.value);
}


//===========================================================
// 計算
//===========================================================

//-----------------------------
// 税額計算
//-----------------------------
// Matrix[VALUES][n]相続分による取得金額（1000千円）
// Matrix[RATE][n]税率（％）
// Matrix[EXCEPT][n]控除額（千円）
// 相続額 inherited

function calcTax(inherited){
for  ( i = 0 ; i < 8 ; i++ )  {
if ( inherited <= Matrix[VALUES][i] ) {
result = ( inherited * (Matrix[RATE][i] / 100) - Matrix[EXCEPT][i] );
return result;
}
}
}

//-----------------------------
// カンマの挿入
//-----------------------------
function insertComma(
val
)
{
str = val + '';
n = str.length;
result = "";
for ( i = n; i > 0; i-- ) {
c = str.substr(i-1, 1);
if ( (((n-i+1) % 3) == 0) && (i > 1) ) {
result = ',' + c + result;
} else {
result = c + result;
}
}
return result;
}

//-----------------------------
// 計算メイン
//-----------------------------
function calc()
{
var totalInherits;// 課税価格
var inheritedValue;// 課税遺産総額
var ptinherits;// 配偶者の相続額
var pttax;// 配偶者の相続税額
var otinherits;// その他の相続額
var ottax;// その他の相続税額
var totalTax;// 相続税の総額
var allPerson;// 法定相続人の数

var vrealestate;
var vcashsaving;
var vsecurities;
var vinsurance;
var vothermoney;
var vowing;
var kazeihoken;
var hokensouzoku;
var hokenkoujo;

hokensouzoku = NumPerson + PartnerExists;


vrealestate = parseInt(document.MAIN.REALESTATE.value);
vrealestate = parseInt(document.MAIN.REALESTATE.value);
vcashsaving = parseInt(document.MAIN.CASHSAVING.value);
vsecurities = parseInt(document.MAIN.SECURITIES.value);
vinsurance = parseInt(document.MAIN.INSURANCE.value);
hokenkoujo = 500 * hokensouzoku;
if(vinsurance < hokenkoujo){
	kazeihoken = 0;
}else{
	kazeihoken = vinsurance - 500 * hokensouzoku;
}

vothermoney = parseInt(document.MAIN.OTHERMONEY.value);
vowing = parseInt(document.MAIN.OWING.value);

//---------------------------
// 入力チェック
//st = document.MAIN.TOTALINHERIT.value;

//for ( i = 0; i < st.length; i++ ) {
//c = st.charAt(i);
//if ( (c < "0") || (c > "9") ) {
//alert("「課税価格の合計額」には数値を入力してください");
//return;
//}
//}

//---------------------------
// パラメータの取り出し


switch (NumWariai){
case 0:
rtPartner = 1/ NumPerson;
break;	
case 10:	
rtPartner = 1/10;
break;	
case 20:	
rtPartner = 2/10;
break;	
case 30:	
rtPartner = 3/10;
break;	
case 40:	
rtPartner = 4/10;
break;	
case 50:	
rtPartner = 5/10;
break;	
case 60:	
rtPartner = 6/10;
break;	
case 70:	
rtPartner = 7/10;
break;	
case 80:	
rtPartner = 8/10;
break;	
case 90:	
rtPartner = 9/10;
break;
case 100:	
rtPartner = 10/10;
break;
//default: alert("プログラムエラー：管理者に連絡してください");
}

// 法定相続人の数
allPerson = NumPerson + PartnerExists;// その他＋配偶者

// 課税価格



totalInherits = Math.floor(vrealestate + vcashsaving + vsecurities + vinsurance + vothermoney - vowing)*10000;
//totalInherits = parseInt(document.MAIN.TOTALINHERIT.value) * 10000;


// TEST値
document.MAIN.TEST.value = kazeihoken;


//---------------------------
// 計算

// 基礎控除額
exceptValue = 30000000 + 6000000 * allPerson;

// 課税総額
inheritedValue = totalInherits - exceptValue - (vinsurance - kazeihoken) * 10000;

if (inheritedValue <= 0) {

// 控除してゼロなら相続税なし
totalTax = 0;
alert("基礎控除後の課税遺産総額がゼロ以下\nになるため非課税となります。");



//------------
// 表示



// 課税総額
document.MAIN.TOTALINCOME.value = insertComma(totalInherits / 10000);
// 基礎控除額
document.MAIN.EXCEPTVAL.value = insertComma(exceptValue / 10000) + "万円";
// 課税遺産総額
document.MAIN.ALLINHERIT.value = insertComma(inheritedValue / 10000);

// その他はクリア
document.MAIN.PTRATE.value = "--";
document.MAIN.PTINCOME.value = "--";
document.MAIN.PTTAX.value = "--";
document.MAIN.OTRATE.value = "--";
document.MAIN.OTINCOME.value = "--";
document.MAIN.OTTAX.value = "--";
document.MAIN.NPERSON.value = "--";
document.MAIN.TOTALTAX.value = "0";
document.MAIN.IPERS.value = hokensouzoku;
document.MAIN.INSDEDUCT.value = 500 * hokensouzoku  + "万円";

return;

} else {

// 配偶者の相続額＝課税遺産総額×配偶者の相続分

if ( PartnerExists == 1 ) {
// 配偶者あり
// 配偶者の税額
ptinherits = Math.floor(inheritedValue * NumWariai/100) / 10000; // 相続額
pttax = calcTax(ptinherits);

totalTax = pttax;

// 配偶者以外の税額
otinherits = Math.floor(inheritedValue * ((100 - NumWariai)/100) / NumPerson) / 10000;// 相続額



ottax = calcTax(otinherits);

totalTax += ( ottax * NumPerson );
//totalTax = totalTax * (1 - rtPartner);

} else {// 配偶者なし
otinherits = Math.floor(inheritedValue / NumPerson) / 10000;
ottax = calcTax(otinherits);
totalTax = ottax * NumPerson;
}
}

//---------------------------
// 結果の出力

// 課税総額
document.MAIN.TOTALINCOME.value = insertComma(totalInherits / 10000) + "万円";

// 基礎控除額
document.MAIN.EXCEPTVAL.value = insertComma(exceptValue / 10000) + "万円";

// 課税遺産総額
document.MAIN.ALLINHERIT.value = insertComma(inheritedValue / 10000) + "万円";



// 配偶者
if ( PartnerExists == 1 ) {
// 配偶者が存在する
	switch (NumWariai) {
		case 10:
		document.MAIN.PTRATE.value = "10％";
		break;
		case 20:
		document.MAIN.PTRATE.value = "20％";
		break;
		case 30:
		document.MAIN.PTRATE.value = "30％";
		break;
		case 40:
		document.MAIN.PTRATE.value = "40％";
		break;
		case 50:
		document.MAIN.PTRATE.value = "50％";
		break;
		case 60:
		document.MAIN.PTRATE.value = "60％";
		break;
		case 70:
		document.MAIN.PTRATE.value = "70％";
		break;
		case 80:
		document.MAIN.PTRATE.value = "80％";
		break;
		case 90:
		document.MAIN.PTRATE.value = "90％";
		break;
		case 100:
		document.MAIN.PTRATE.value = "100％";
		break;
	}
document.MAIN.PTINCOME.value = parseInt(ptinherits) + "万円";// 取得金額
document.MAIN.PTTAX.value = parseInt(pttax) + "万円"; // 税額

} else {
	// 配偶者が存在しない
	document.MAIN.PTRATE.value = "配偶者なし";
	document.MAIN.PTINCOME.value = "--";
	document.MAIN.PTTAX.value = "--";
}

// その他の相続人
if ( PartnerExists == 1 ) {
// 配偶者が存在する
document.MAIN.OTRATE.value = parseInt(Math.floor((100 - NumWariai) / NumPerson)) + "％";

document.MAIN.OTINCOME.value = parseInt(otinherits) + "万円";// 取得金額
//document.MAIN.OTTAX.value = insertComma(ottax);// 税額
document.MAIN.OTTAX.value = parseInt(ottax) + "万円" ;// 税額
} else {
// 配偶者が存在しない
document.MAIN.OTRATE.value = parseInt(Math.floor(100 / NumPerson)) + "％";// 均等
//document.MAIN.OTRATE.value = Math.floor(100 / NumPerson) + "％"; // 均等
document.MAIN.OTINCOME.value = parseInt(otinherits) + "万円";// 取得金額
document.MAIN.OTTAX.value = parseInt(ottax) + "万円";// 税額
}


// 法定相続人の数
document.MAIN.NPERS.value = allPerson;
document.MAIN.IPERS.value = hokensouzoku;
document.MAIN.NPERSON.value = allPerson;
document.MAIN.INSDEDUCT.value = 500 * hokensouzoku  + "万円";

// 相続税の総額
total = (Math.floor( totalTax )) + "";
document.MAIN.TOTALTAX.value = total + "万円";


}



