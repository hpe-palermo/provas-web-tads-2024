// Inicializa o select de cidades
const select_cidades = document.getElementById('cidades');

// Adiciona as cidades ao select
cidades.forEach((cidade) => {
    const option = document.createElement('option');
    option.text = cidade;
    option.value = cidade;
    select_cidades.add(option);
});

// Variáveis globais
const divFormCep = document.getElementById('form_pesquisa_cep');
const divFormRua = document.getElementById('form_pesquisa_rua');
const btn_para_cep = document.getElementById('btn_para_cep');
const btn_para_rua = document.getElementById('btn_para_rua');
const input_cep = document.getElementById('cep');
const resultados_ruas = document.getElementById('resultados_ruas');

function exibirFormularioRua() {
    // Exibe o formulário de busca por Rua
    divFormCep.classList.add('hidden');
    divFormRua.classList.remove('hidden');
  }

  function exibirFormularioCEP() {
    // Exibe o formulário de busca por CEP
    divFormCep.classList.remove('hidden');
    divFormRua.classList.add('hidden');
  }

async function pesquisarPorCEP(cep) {
    // Valida se o campo de cep não está vazio.
    if (document.getElementById('cep').value === "") {
        const erro = '<small id="erro-cep" class="text-danger">Preencha o campo do CEP!</small>';

        let alerta_erro = document.getElementById('erro-cep');
        if (!alerta_erro) {
            input_cep.insertAdjacentHTML("afterend", erro);
        }
        return;
    }

    // Fazer requisição
    try {
        const URL = `https://viacep.com.br/ws/${cep}/json/`;
        const response = await fetch(URL);
        const data = await response.json();
        console.log(data);

        if (Object.hasOwn(data, 'cep')) {
            let alerta_erro = document.getElementById('erro-cep');
            if (alerta_erro) {
                alerta_erro.remove();
            }

            preencherCamposNoFormCEP(data);
        } else {
            limparCamposNoFormCEP();
            const erro = '<small id="erro-cep" class="text-danger">Nenhum resultado encontrado!</small>';

            let alerta_erro = document.getElementById('erro-cep');
            if (!alerta_erro) {
                input_cep.insertAdjacentHTML("afterend", erro);
            }
        }

    } catch (err) {
        console.error("Erro ao fazer a requisição:", err);
    }
}

function limparCamposNoFormCEP() {
    // Limpa os campos do formulário de CEP
    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
    document.getElementById('ibge').value = '';
}

function preencherCamposNoFormCEP(data) {
    // Preenche os campos com os dados retornados da API
    document.getElementById('rua').value = data.logradouro || 'Não encontrado';
    document.getElementById('bairro').value = data.bairro || 'Não encontrado';
    document.getElementById('cidade').value = data.localidade || 'Não encontrado';
    document.getElementById('estado').value = data.estado || 'Não encontrado';
    document.getElementById('ibge').value = data.ibge || 'Não encontrado';
}

async function pesquisarPorRua(cidade, rua) {
    console.log("Dados: ", cidade, rua);

    // tira daqui e colocar globalmente
    const cidades = document.getElementById('cidades'); // global
    const rua_form2 = document.getElementById('rua_form2'); // global

    // Valida se o campo da rua não está vazio.
    if (cidades.value === "") {
        const erro = '<small id="erro-cidade-2" class="text-danger">Selecione uma cidade!</small>';
        let alerta_erro = document.getElementById('erro-cidade-2');
        if (!alerta_erro) {
            cidades.insertAdjacentHTML("afterend", erro);
        }
        return;
    }

    let alerta_erro = document.getElementById('erro-cidade-2');
    if (alerta_erro) {
        alerta_erro.remove();
    }

    if (rua_form2.value === "") {
        const erro = '<small id="erro-rua-2" class="text-danger">Nome da rua obrigatório!</small>';
        let alerta_erro = document.getElementById('erro-rua-2');
        if (!alerta_erro) {
            rua_form2.insertAdjacentHTML("afterend", erro);
        }
        return;
    }

    // Remover o alerta de erro anterior
    alerta_erro = document.getElementById('erro-rua-2');
    if (alerta_erro) {
        alerta_erro.remove();
    }

    // Exibir o gif enquanto espera os dados
    resultados_ruas.innerHTML = `
        <div class="text-white d-flex justify-content-center align-items-center p-2 h-100" id="loading_gif">
            <img src="assets/img/loading-gif.gif" alt="Loading..." class="mx-auto d-block" width="50" style="positon: absolute; z-index: 99;">
        </div>
    `;

    // Fazer requisição
    try {
        const URL = `https://viacep.com.br/ws/PR/${cidade}/${rua}/json/`;
        const response = await fetch(URL);

        if (!response.ok) {
            if (!response.ok) {
                const errorDetails = await response.text();
                console.error("Detalhes do erro:", errorDetails);
            }
        } else {
            const data = await response.json();
            console.log(data);
            preencherCamposNoFormRua(data);
        }

    } catch (err) {
        console.error("Erro ao fazer a requisição:", err);
        resultados_ruas.innerHTML = `
            <div class="text-white d-flex justify-content-center align-items-center p-2 h-100">
                <h5>Nenhum resultado encontrado.</h5>
            </div>
        `;

    }
}

function preencherCamposNoFormRua(resultados) {
    // Limpar os resultados existentes
    resultados_ruas.innerHTML = '';

    // Se não houver resultados
    if (resultados.length === 0) {
        resultados_ruas.innerHTML = `
            <div class="text-white d-flex justify-content-center align-items-center p-2 h-100">
                <h5>Nenhum resultado encontrado.</h5>
            </div>
        `;
        console.log("object")
        return;
    }

    resultados.forEach(item => {
        if (!item.logradouro) item.logradouro = "Logradouro não encontrado";
        if (!item.bairro) item.bairro = "Bairro não encontrado";

        resultados_ruas.innerHTML += `
            <div class="text-white d-flex align-items-center p-2">
                ${item.logradouro}, ${item.bairro} - ${item.cep}
            </div>
        `;
    });
}