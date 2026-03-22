require('dotenv').config({ path: '.env.local' });
const postmark = require('postmark');

const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

console.log('--- Postmark Diagnostic ---');
console.log('Token:', process.env.POSTMARK_API_TOKEN);
console.log('Sender:', process.env.POSTMARK_SENDER);

client.sendEmail({
  "From": process.env.POSTMARK_SENDER,
  "To": "victor.vilche@conecta.cl",
  "Subject": "Postmark Diagnostic Test",
  "TextBody": "Si recibes esto, la integración de Postmark es correcta.",
  "MessageStream": "outbound"
}).then(response => {
  console.log('✅ Éxito:', response);
}).catch(error => {
  console.error('❌ Error:', error.message);
  console.error('Detalles:', error);
});
