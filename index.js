const fs = require('fs');
const crypto = require('crypto');
const FormData = require('form-data');

const codenationAPI = require('./services/codenation');

async function ceasarDecrypt() {

  const jsonPath = 'answer.json';
  const token = '22b0eddd9ac24610bae94cbd164d7febe3186d66';

  const url_generate = `generate-data?token=${token}`;
  const { data } = await codenationAPI.get(`/${url_generate}`);
  const { numero_casas, cifrado } = data;

  const shaOne = crypto.createHash('sha1')

  fs.writeFileSync(jsonPath, JSON.stringify(data));

  const decrypted = decrypt(numero_casas, cifrado);
  shaOne.update(decrypted);

  const answer = JSON.parse(fs.readFileSync(jsonPath));

  answer.decifrado = decrypted;
  answer.resumo_criptografico = shaOne.digest('hex');

  fs.writeFileSync(jsonPath, JSON.stringify(answer));
  submitSolution(token, jsonPath);

}

async function submitSolution(token, path) {
  try {
    const form = new FormData();
    form.append('answer', fs.createReadStream(path), path);

    const url_submit_solution = `submit-solution?token=${token}`;
    const result = await codenationAPI({
      method: 'POST',
      headers: form.getHeaders(),
      url: `/${url_submit_solution}`,
      data: form
    });

    console.log({ result: result.data });
    console.log('======== sended ========');

  } catch ({ response }) {
    console.log({ response: response.data })
  }

}

function decrypt(key, text) {

  let textDecoded = '';
  const textLowered = text.toLowerCase();

  for (let char of textLowered) {

    const charCode = char.charCodeAt();

    if (charCode >= 97 && charCode <= 122) {
      const decodedChar = String.fromCharCode((charCode - 97 - key + 26) % 26 + 97);
      textDecoded += decodedChar;
    }
    else {
      textDecoded += char;
    }
  }

  return textDecoded;

}

ceasarDecrypt();
