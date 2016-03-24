/**
 * GASでファイル操作する総合クラス.
 * @param folderName string googleDriveのルートに作成する作業フォルダ名
 */
var GAS = function(columnNames) {
  this.columnNames = columnNames;
};


/**
 * フォルダを取得する.
 * もし存在しない場合は作成する.
 * もし複数該当する場合は、始めのものを取得する.
 * @param {String} folderName フォルダの名前
 * @return {Folder} フォルダクラス undefinedで失敗
 */
GAS.prototype.ensureFolder = function(folderName) {
  if (folderName != undefined) {
    var folderIt = DriveApp.getFoldersByName(folderName);
    var folder;
    if (folderIt.hasNext()) {
      folder = folderIt.next();
      Logger.log("Folder opened. name=" + folder.getName());
    } else {
      folder = DriveApp.createFolder(folderName);
      Logger.log(">path="+folder.getUrl());
    }
    return folder;
  }
  return undefined;
}







/**
 * スプレッドシートを取得する.（非チェック）
 * もし存在しない場合は作成する.
 * もし複数該当する場合は、始めのものを取得する.
 * 「シート1」が存在している場合、「log」にリネーム.
 * @param {Folder} folder 取得する親フォルダ
 * @param {String} fileName ファイルの名前
 * @return {Spreadsheet} スプレッドシート undefinedで失敗
 */
GAS.prototype.ensureSpreadsheetFile = function(folder, fileName) {
  if (folder != undefined && fileName != undefined) {
    var fileIt = folder.getFilesByName(fileName);
    var file;
    if (fileIt.hasNext()) {
      file = fileIt.next();
      Logger.log("Spreadsheet File is opened. name=" + file.getName());
    } else {
      var ssId = SpreadsheetApp.create(fileName).getId();
      file = DriveApp.getFileById(ssId)
      folder.addFile(file);
      DriveApp.getRootFolder().removeFile(file);
      Logger.log("Spreadsheet File created. name=" + file.getName());
      Logger.log("path="+file.getUrl());
    }
    return this.openSpreadsheet(file);
  }
  return undefined;
}

/**
 * スプレッドシートを開く.（非チェック＆内部で使用）
 * @param {File} file スプレッドシートのファイル
 * @return {Spreadsheet} スプレッドシート
 */
GAS.prototype.openSpreadsheet = function(file) {
  var spread = SpreadsheetApp.open(file);
  
  var sheet = spread.getSheetByName("シート1");
  if (sheet != undefined) {
    sheet.setName(LOG_SHEET_NAME);
  }
  
  return spread;
}


/**
 * シートを取得する.
 * もし存在しない場合はフォーマットを作成する.
 * @param {Spreadsheet} spread 対象のスプレッドシート
 * @param {string} sheetNum シートの名前
 * @return {file} ファイルクラス nullで失敗
 */
GAS.prototype.ensureSheet = function(spread, sheetName) {
  var sheet = spread.getSheetByName(sheetName);
  if (sheet == undefined) {
    sheet = spread.insertSheet(sheetName);
    sheet.appendRow(this.columnNames);
    Logger.log("Sheet created. name="+sheet.getName());
  } else {
    Logger.log("Sheet opened. name=" + sheet.getName());
  }
  
  return sheet;    
}







/**
 * ドキュメントを取得する.（非チェック）
 * もし存在しない場合は作成する.
 * もし複数該当する場合は、始めのものを取得する.
 * @param {Folder} folder 取得する親フォルダ
 * @param {String} fileName ファイルの名前
 * @return {Document} ドキュメント undefinedで失敗
 */
GAS.prototype.ensureDocumentFile = function(folder, fileName) {
  if (folder != undefined && fileName != undefined) {
    var fileIt = folder.getFilesByName(fileName);
    var file;
    if (fileIt.hasNext()) {
      file = fileIt.next();
      Logger.log("Document File is opened. name=" + file.getName());
    } else {
      var docId = DocumentApp.create(fileName).getId();
      file = DriveApp.getFileById(docId)
      folder.addFile(file);
      DriveApp.getRootFolder().removeFile(file);
      Logger.log("Document File created. name=" + file.getName());
      Logger.log("path="+file.getUrl());
    }
    return this.openDocument(file);
  }
  return undefined;
}

/**
 * ドキュメントを開く.（非チェック＆内部で使用）
 * @param {File} file ドキュメントのファイル
 * @return {Document} ドキュメント
 */
GAS.prototype.openDocument = function(file) {
  var doc = DocumentApp.openById(file.getId());  
  return doc;
}
