const error = document.getElementById('error');
const themeToggle = document.getElementById('theme');
const dicionario = document.getElementById('dicionario');
const home = document.getElementById('home');
home.style.display = 'flex';

// Função para buscar uma palavra
function buscaPalavra(palavra) {
    fetch(`https://dicionario-production.up.railway.app/${palavra}`)
        .then(response => response.text())
        .then(data => {
            data = JSON.parse(data);

            if (data?.error) {
                dicionario.style.display = 'none';
                error.style.display = 'flex';
                home.style.display = 'none';
            }

            const word = data.palavra;
            const significado = data.textosSignificado;
            const textosFrases = data.textosFrases;
            const textosSinonimos = data.textosSinonimos;
            // console.log(data);

            const resposta = document.getElementById('resposta');
            resposta.innerHTML = '';

            const frases = document.getElementById('frases');
            frases.innerHTML = '';
            const frasesDiv = document.getElementsByClassName('frases')[0];
            textosFrases.length === 0 ? frasesDiv.style.display = 'none' : frasesDiv.style.display = 'flex';

            const sinonimos = document.getElementById('sinonimos');
            sinonimos.innerHTML = '';
            const sinonimosDiv = document.getElementsByClassName('sinonimos')[0];
            textosSinonimos.length === 0 ? sinonimosDiv.style.display = 'none' : sinonimosDiv.style.display = 'flex';

            for (let i = 0; i < significado.length; i++) {
                const itemDiv = document.createElement("span");
                itemDiv.innerHTML = significado[i].replace(/\n/g, "<br>");
                resposta.appendChild(itemDiv);
            }

            for (let i = 0; i < textosFrases.length; i++) {
                const itemDiv = document.createElement("span");
                itemDiv.innerHTML = textosFrases[i].replace(/\n/g, "<br>");
                frases.appendChild(itemDiv);
            }

            for (let i = 0; i < textosSinonimos.length; i++) {
                const itemDiv = document.createElement("span");
                itemDiv.innerHTML = textosSinonimos[i].replace(/\n/g, "<br>");
                sinonimos.appendChild(itemDiv);
            }

            document.getElementById('word').innerHTML = word;
            dicionario.style.display = 'flex';
            error.style.display = 'none';
            home.style.display = 'none';
        })
        .catch(err => {
            dicionario.style.display = 'none';
            error.style.display = 'flex';
            console.error('Ocorreu um erro:', err);
        });
}

// Função para buscar ao clicar no botão
function buscaButton() {
    const search = document.getElementById('search').value;
    const error = document.getElementById('errorInput').value;
    const home = document.getElementById('homeInput').value;

    search !== '' ? buscaPalavra(search) 
    : error !== '' ? buscaPalavra(error)
    : home !== '' ? buscaPalavra(home)
    : ''
}

// Event listeners para busca ao pressionar Enter
document.getElementById("search").addEventListener("keyup", function (event) {
    const input = document.getElementById('search');
    const value = input.value;

    if (event.keyCode === 13) {
        event.preventDefault();
        buscaPalavra(value);
        input.value = '';
    }
});

document.getElementById("errorInput").addEventListener("keyup", function (event) {
    const input = document.getElementById('errorInput');
    const value = input.value;

    if (event.keyCode === 13) {
        event.preventDefault();
        buscaPalavra(value);
        input.value = '';
    }
});

document.getElementById("homeInput").addEventListener("keyup", function (event) {
    const input = document.getElementById('homeInput');
    const value = input.value;

    if (event.keyCode === 13) {
        event.preventDefault();
        buscaPalavra(value);
        input.value = '';
    }
});

// Event listener para alternar o tema
themeToggle.addEventListener('change', function() {
    if (this.checked) {
        dicionario.classList.add('dark');
    } else {
        dicionario.classList.remove('dark');
    }
});