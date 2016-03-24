
var TOKEN = "xoxp-27696326519-27646578275-27924346339-f214b4535a";
var FOLDER_NAME = "slack";
var MES_FILE_NAME_PREFIX = "Mes";
var MES_FILE_NAME;

var LOG_FILE_NAME_PREFIX = "Log";
var LOG_FILE_NAME;


function mainFunction() {
  Logger.log("run.");
  
  initilise();  
  
  // 各オブジェクトの生成
  var slack = new Slack(TOKEN);
  var gas = new GAS(slack.columnNames);
  
  // スプレッドシートを取得
  var folder = gas.ensureFolder(FOLDER_NAME);
  var spread = gas.ensureSpreadsheetFile(folder, MES_FILE_NAME);
  var document = gas.ensureDocumentFile(folder, LOG_FILE_NAME);
  
  // チャンネルリストを取得
  var chList = slack.getChannelList();
  Logger.log("channelNum=" + chList.length);
  Logger.log("--------------------------------------------------");
  
  
  for (var i=0; i<1; i++) {
    var ch = chList[i];
    Logger.log(">channel="+ch.name+"("+ch.id+")");
    
    // シートを取得
    var sheet = gas.ensureSheet(spread, "#"+ch.name);
    var row = sheet.getLastRow();
    
    // 取得する一番古い時間を読み込む
    var oldest = "0";
    if (row != 1) {
      var range = sheet.getRange(row, slack.col_ts+1);
      oldest = range.getValue();
    }
    
    // メッセージを読み込み、シートに書き込む
    var array = slack.getMessageList(ch.id, oldest);
    if (array != null) {
      for (var j=0; j<array.length; j++) {
        array[j][0] = row++;
        sheet.appendRow(array[j]);
      }
      Logger.log(">append row = "+j);
    } else {
      Logger.log(">message not founds.");
    }
  }
  
  Logger.log("finish.");
  
  
  
  // ログファイル書き出し
  var body = document.getBody();
  var text = body.editAsText();
  text.appendText(Logger.getLog());  
}





// 初期化
function initilise() {
  // 名前生成
  var date = new Date(); 
  MES_FILE_NAME = MES_FILE_NAME_PREFIX + date.getFullYear() + ("0"+(date.getMonth()+1)).slice(-2);
  LOG_FILE_NAME = LOG_FILE_NAME_PREFIX + date.getFullYear() + ("0"+(date.getMonth()+1)).slice(-2) + ("0"+(date.getDate())).slice(-2) 
                + ("0"+(date.getHours())).slice(-2) + ("0"+(date.getMinutes())).slice(-2) + ("0"+(date.getSeconds())).slice(-2);
}