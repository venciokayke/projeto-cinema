const salvarFilme = (Event) => {
  Event.preventDefault();

  //captura dos valores dos inputs
  const titulo = document.getElementById("titulo").value;
  const genero = document.getElementById("genero").value;
  const descricao = document.getElementById("descricao").value;
  const classificacao = document.getElementById("classificacao").value;
  const duracao = document.getElementById("duracao").value;
  const estreia = document.getElementById("estreia").value;

  //cria o objeto do filme
  const novoFilme = {
    id: Date.now(),
    titulo,
    genero,
    descricao,
    classificacao,
    duracao,
    estreia,
  };

  //busca a lista que já existe no LocalStorage ou cria uma vazia
  const filmesLocalStorage = JSON.parse(localStorage.getItem("filmes")) || [];

  //adiciona o novo filme na lista
  filmesLocalStorage.push(novoFilme);

  //salva de volta no LocalStorage
  localStorage.setItem("filmes", JSON.stringify(filmesLocalStorage));

  //limpa o formulário e da o aviso de sucesso
  document.getElementById("formFilme").reset();
  alert("Filme cadastado com sucesso!");
};

const formFilme = document.getElementById("formFilme");
if (formFilme) {
  formFilme.addEventListener("submit", salvarFilme);
}

const salvarSala = (Event) => {
  Event.preventDefault();

  //captura dos valores dos inputs
  const nomeSala = document.getElementById("nomeSala").value;
  const capacidade = document.getElementById("capacidade").value;
  const tipo = document.getElementById("tipo").value;

  //cria o objeto da Sala
  const novaSala = {
    id: Date.now(),
    nomeSala,
    capacidade,
    tipo,
  };

  //busca a lista que já existe no LocalStorage ou cria uma vazia
  const salasLocalStorage = JSON.parse(localStorage.getItem("salas")) || [];

  //adiciona a nova sala na lista
  salasLocalStorage.push(novaSala);

  //salva de volta no LocalStorage
  localStorage.setItem("salas", JSON.stringify(salasLocalStorage));

  //limpa o formulário e da o aviso de sucesso
  document.getElementById("formSala").reset();
  alert("Sala cadastada com sucesso!");
};

const formSala = document.getElementById("formSala");
if (formSala) {
  formSala.addEventListener("submit", salvarSala);
}

const popularSelectsSessao = () => {
  const selectFilme = document.getElementById("filmeSessao");
  const selectSala = document.getElementById("salaSessao");

  if (!selectFilme || !selectSala) return;

  //busca dados do LocalStorage
  const filmes = JSON.parse(localStorage.getItem("filmes")) || [];
  const salas = JSON.parse(localStorage.getItem("salas")) || [];

  //preenche Select de Filmes
  filmes.forEach((filme) => {
    const option = document.createElement("option");
    option.value = filme.titulo;
    option.textContent = filme.titulo;
    selectFilme.appendChild(option);
  });

  //preencher Select de Salas
  salas.forEach((sala) => {
    const option = document.createElement("option");
    option.value = sala.nomeSala;
    option.textContent = `${sala.nomeSala} (${sala.tipo})`;
    selectSala.appendChild(option);
  });
};

popularSelectsSessao();

const salvarSessao = (event) => {
  event.preventDefault();

  const novaSessao = {
    id: Date.now(),
    filme: document.getElementById("filmeSessao").value,
    sala: document.getElementById("salaSessao").value,
    dataHora: document.getElementById("dataHora").value,
    preco: document.getElementById("preco").value,
    idioma: document.getElementById("idioma").value,
  };

  const sessoes = JSON.parse(localStorage.getItem("sessoes")) || [];
  sessoes.push(novaSessao);
  localStorage.setItem("sessoes", JSON.stringify(sessoes));

  document.getElementById("formSessao").reset();
  alert("Sessão criada com sucesso!");
};

//liga ao formulário
const formSessao = document.getElementById("formSessao");
if (formSessao) {
  formSessao.addEventListener("submit", salvarSessao);
}

//lista todas as sessões salvas no LocalStorage em uma tabela
const listarSessoes = () => {
  const corpoTabela = document.getElementById("corpoTabelaSessoes");
  const mensagemVazia = document.getElementById("mensagemVazia");

  if (!corpoTabela) return;

  //busca as sessões do LocalStorage
  const sessoes = JSON.parse(localStorage.getItem("sessoes")) || [];

  //exibe mensagem se não há sessões
  if (sessoes.length === 0) {
    mensagemVazia.classList.remove("d-none");
    return;
  }

  //limpa a tabela antes de preencher
  corpoTabela.innerHTML = "";

  //popula a tabela com as sessões
  sessoes.forEach((sessao) => {
    //formata a data para padrão brasileiro
    const dataFormat = new Date(sessao.dataHora).toLocaleString("pt-BR");

    const tr = document.createElement("tr");

    tr.innerHTML = `
     <td><strong>${sessao.filme}</strong></td>
            <td>${sessao.sala}</td>
            <td>${dataFormat}</td>
            <td>R$ ${parseFloat(sessao.preco).toFixed(2)}</td>
            <td><span class="badge bg-info text-dark">${sessao.idioma}</span></td>
            <td>
                <button class="btn btn-success btn-sm" onclick="comprarIngresso(${sessao.id})">
                    Comprar
                </button>
            </td>
        `;

        corpoTabela.appendChild(tr);
  });
};

//armazena a sessão selecionada e redireciona para a página de venda
const comprarIngresso = (idSessao) => {
    //salva o ID da sessão no LocalStorage
    localStorage.setItem('sessaoSelecionada', idSessao);
    //redireciona para página de venda de ingressos
    window.location.href = 'venda-ingressos.html';
};

//executa a listagem de sessões quando a página carrega
listarSessoes();

//popula o select de sessões na página de venda com as sessões armazenadas
const popularSelectVenda = () => {
    const selectSessao = document.getElementById('sessaoVenda');
    if (!selectSessao) return;

    //busca as sessões e a sessão selecionada do LocalStorage
    const sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    const sessaoSelecionadaId = localStorage.getItem('sessaoSelecionada');

    //reseta o select com opção padrão
    selectSessao.innerHTML = '<option value="">Selecione a sessão...</option>';

    //adiciona cada sessão como uma opção no select
    sessoes.forEach(sessao => {
        const option = document.createElement('option');
        option.value = sessao.id;
        option.textContent = `${sessao.filme} - ${sessao.sala} (${sessao.idioma})`;
        
        //marca a sessão selecionada como pré-selecionada
        if (sessao.id == sessaoSelecionadaId) {
            option.selected = true;
        }
        
        selectSessao.appendChild(option);
    });

    //remove a variável de sessão selecionada após usar
    localStorage.removeItem('sessaoSelecionada');
};
//executa a população do select ao carregar a página
popularSelectVenda();

//confirma e salva a venda de ingressos
const confirmarVenda = (event) => {
    event.preventDefault();

    //cria o objeto com os dados da venda
    const novaVenda = {
        idVenda: Date.now(),
        idSessao: document.getElementById('sessaoVenda').value,
        nomeCliente: document.getElementById('nomeCliente').value,
        cpf: document.getElementById('cpfCliente').value,
        assento: document.getElementById('assento').value.toUpperCase(),
        pagamento: document.getElementById('pagamento').value
    };

    //busca as vendas existentes ou cria uma lista vazia
    const vendasExistentes = JSON.parse(localStorage.getItem('ingressos')) || [];
    //adiciona a nova venda na lista
    vendasExistentes.push(novaVenda);
    //salva a lista atualizada no LocalStorage
    localStorage.setItem('ingressos', JSON.stringify(vendasExistentes));

    //exibe mensagem de sucesso
    alert(`Venda confirmada para ${novaVenda.nomeCliente}! Assento: ${novaVenda.assento}`);
    
    //limpa o formulário
    document.getElementById('formVenda').reset();
    //redireciona para a página inicial
    window.location.href = 'index.html';
};

//localiza o formulário de venda e adiciona evento de submissão
const formVenda = document.getElementById('formVenda');
if (formVenda) {
    formVenda.addEventListener('submit', confirmarVenda);
}