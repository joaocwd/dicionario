"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const port = process.env.PORT;
// Rota para buscar palavra
app.get('/:word', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const word = req.params.word;
        const resposta = yield extrairConteudoPagina(word);
        res.send(resposta);
    }
    catch (error) {
        res.status(404).send({ error: 'not found' });
    }
}));
app.listen(port, () => {
    console.log(`⚡️ Servidor rodando em http://localhost:${port}`);
});
// Função que extrai o conteudo de dicio.com.br
function extrairConteudoPagina(word) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://www.dicio.com.br/${removerAcentos(word)}/`;
            const response = yield axios_1.default.get(url);
            const html = response.data;
            const $ = (0, cheerio_1.load)(html);
            // Remove as tags <style>
            $('style').remove();
            // Remove as tags <script>
            $('script').remove();
            // Executa a consulta XPath para extrair o dado desejado
            const palavra = $('h1').text().trim();
            const significado = $('p.significado span');
            const verbo = $('h3.tit-significado--singular').text().replace('Significado de ', '');
            const significadoVerbo = $('p.conjugacao span');
            const sinonimos = $('p.sinonimos a');
            const frases = $('div.frase span');
            const textosSignificado = [];
            const textosVerboArray = [];
            const textosSinonimos = [];
            const textosFrases = [];
            significado.each(function () {
                textosSignificado.push($(this).text());
            });
            significadoVerbo.each(function () {
                textosVerboArray.push($(this).text());
            });
            sinonimos.each(function () {
                textosSinonimos.push($(this).text());
            });
            frases.each(function () {
                textosFrases.push($(this).text());
            });
            return {
                palavra,
                textosSignificado,
                verbo,
                textosVerboArray,
                textosSinonimos,
                textosFrases
            };
        }
        catch (error) {
            console.error('Ocorreu um erro na requisição:', error);
            throw error;
        }
    });
}
function removerAcentos(palavra) {
    return palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
