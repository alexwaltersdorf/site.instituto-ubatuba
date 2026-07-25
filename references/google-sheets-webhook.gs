/**
 * Webhook do Google Apps Script para a planilha
 * "Instituto Ubatuba — Cadastro de Alunos (Cursos)".
 *
 * COMO USAR (uma única vez):
 * 1. Abra a planilha no Google Sheets.
 * 2. Menu: Extensões → Apps Script.
 * 3. Apague o conteúdo padrão e cole TODO este arquivo.
 * 4. Clique em Implantar (Deploy) → Nova implantação.
 * 5. Tipo: "App da Web" (Web app).
 *    - Executar como: Eu (sua conta)
 *    - Quem tem acesso: Qualquer pessoa (Anyone)
 * 6. Implantar → Autorize o acesso quando pedir.
 * 7. Copie a "URL do app da Web" (termina em /exec).
 * 8. No hPanel da Hostinger → institutoubatuba.org → Variáveis de ambiente,
 *    adicione a variável:
 *      Chave:  SHEETS_WEBHOOK_URL
 *      Valor:  (cole a URL /exec)
 *
 * Pronto. A cada novo cadastro no site, uma linha é adicionada na planilha.
 */

var HEADERS = [
  "Data e Hora do Cadastro",
  "Nome Completo",
  "CPF",
  "Data de Nascimento",
  "Endereço",
  "Número",
  "Bairro",
  "Cidade",
  "CEP",
  "Telefone",
  "E-mail",
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Garante o cabeçalho na primeira linha
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      data.createdAt || new Date().toLocaleString("pt-BR"),
      data.fullName || "",
      data.cpf || "",
      data.birthDate || "",
      data.address || "",
      data.number || "",
      data.neighborhood || "",
      data.city || "",
      data.cep || "",
      data.phone || "",
      data.email || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Permite testar a URL no navegador (deve mostrar "Webhook ativo").
function doGet() {
  return ContentService
    .createTextOutput("Webhook ativo — Instituto Ubatuba (cadastro de alunos).")
    .setMimeType(ContentService.MimeType.TEXT);
}
