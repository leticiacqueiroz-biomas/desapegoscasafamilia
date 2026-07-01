/* ============================================================
   desapegadas — motor dos formulários (Google Apps Script)
   Recebe os formulários do site, salva as fotos no Drive
   e grava nas planilhas de Cadastro e de Avaliações.
   ============================================================ */

// IDs das suas planilhas (já preenchidos):
const SHEET_CADASTRO   = "1937RCD6j1G51_Pra3s6nXOBb-HlC1hOz6Ysg3XVIBb4";
const SHEET_AVALIACAO  = "1YKFOrwBhNtykDaI1ur-uoRs9eSc-JTRDLaNbr1E7Pss";
const SHEET_VENDEDORES = "1XDm_kHpvUIj1wqtD_cOikqW9bmKbwOjCJCxK75eOEbQ";
const PASTA_FOTOS      = "desapegadas - fotos dos anuncios";
const MEU_EMAIL        = "leticiacqueiroz@gmail.com";  // recebe o aviso de novidades

function doPost(e){
  try{
    const d = JSON.parse(e.postData.contents);
    let aviso = "";

    if (d.tipo === "vendedor") {
      const sh = SpreadsheetApp.openById(SHEET_VENDEDORES).getSheets()[0];
      sh.appendRow([ new Date(), d.nome||"", d.whatsapp||"", d.local||"", d.convidou||"", d.sobre||"", "FALSE" ]);
      aviso = "Nova vendedora: " + (d.nome||"") + " (convidada por " + (d.convidou||"?") + ")";

    } else if (d.tipo === "avaliacao") {
      const sh = SpreadsheetApp.openById(SHEET_AVALIACAO).getSheets()[0];
      sh.appendRow([ new Date(), d.vendedor||"", d.nota||"", d.comentario||"", d.comprador||"", "FALSE" ]);
      aviso = "Nova avaliação para " + (d.vendedor||"") + ": " + (d.nota||"") + " estrelas";

    } else { // cadastro de itens (1 ou mais)
      const sh = SpreadsheetApp.openById(SHEET_CADASTRO).getSheets()[0];
      (d.itens || []).forEach(function(it){
        const urls = salvarFotos(it.fotos || [], it.nome || "item");
        sh.appendRow([
          new Date(), d.vendedor||"", d.whatsapp||"", it.nome||"", it.categoria||"",
          it.tamanho||"", it.condicao||"", it.marca||"", it.preco||"",
          urls[0]||"", urls[1]||"", urls[2]||"", it.obs||"", "FALSE"
        ]);
      });
      aviso = (d.itens||[]).length + " novo(s) item(ns) de " + (d.vendedor||"");
    }

    // aviso grátis por e-mail (não derruba o envio se falhar)
    try{ if(aviso) MailApp.sendEmail(MEU_EMAIL, "[desapegadas] " + aviso, aviso + "\n\nConfira e aprove na planilha."); }catch(_){}

    return ContentService.createTextOutput(JSON.stringify({ok:true}))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch(err){
    return ContentService.createTextOutput(JSON.stringify({ok:false, erro:String(err)}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function pastaFotos(){
  const it = DriveApp.getFoldersByName(PASTA_FOTOS);
  return it.hasNext() ? it.next() : DriveApp.createFolder(PASTA_FOTOS);
}

function salvarFotos(fotos, nome){
  const f = pastaFotos();
  const urls = [];
  (fotos || []).slice(0,3).forEach(function(dataUrl, i){
    const m = String(dataUrl).match(/^data:(.+);base64,(.*)$/);
    if(!m) return;
    const blob = Utilities.newBlob(Utilities.base64Decode(m[2]), m[1], nome + "_" + (i+1) + ".jpg");
    const file = f.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    urls.push("https://drive.google.com/thumbnail?id=" + file.getId() + "&sz=w1000");
  });
  return urls;
}

// (opcional) só para testar pelo editor que o script está ok:
function doGet(){
  return ContentService.createTextOutput("desapegadas ok");
}
