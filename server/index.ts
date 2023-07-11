import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { load } from 'cheerio';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

// Rota para buscar palavra
app.get('/:word', async (req: Request, res: Response) => {
    const word = req.params.word;
    const resposta = await extrairConteudoPagina(word)
    res.send(resposta)
});

app.listen(port, () => {
    console.log(`⚡️ Servidor rodando em http://localhost:${port}`);
});

// Função que extrai o conteudo de dicio.com.br
async function extrairConteudoPagina(word: string): Promise<any> {
    try {
        const url = `https://www.dicio.com.br/${word}/`;
        const response = await axios.get(url);
        const html = response.data;
        const $ = load(html);

        // Remove as tags <style>
        $('style').remove();

        // Remove as tags <script>
        $('script').remove();

        // Executa a consulta XPath para extrair o dado desejado
        const palavra = $('h1').text().trim();
        const significado = $('p.significado span')
        const verbo = $('h3.tit-significado--singular').text().replace('Significado de ', '')
        const significadoVerbo = $('p.conjugacao span')
        const sinonimos = $('p.sinonimos a')
        const frases = $('div.frase span')
        const textosSignificado: any = [];
        const textosVerboArray: any = [];
        const textosSinonimos: any = [];
        const textosFrases: any = [];
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
    } catch (error) {
        console.error('Ocorreu um erro na requisição:', error);
        throw error;
    }
}