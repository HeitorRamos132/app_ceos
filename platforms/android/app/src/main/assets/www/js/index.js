document.addEventListener("inicio", executaAcao);
  
function executaAcao() {
  trocaPagina ('login');
}

//troca de páginas
function trocaPagina (page) {
  var pagina = page;
  document.getElementById('txtBusca').value = '';
  console.log('template-'+page)
  var elementoAtual = document.getElementById("template-"+page);
  var template = document.importNode(elementoAtual.content, true);
  document.getElementById("main").innerHTML = "";
  document.getElementById("main").appendChild(template);
  if (pagina == "login") {
    var emailAtual = localStorage.getItem('emailAtual');
    document.getElementById('email').value = emailAtual;
  } else if (pagina == "home") {
    carregaTop();
  }  else if (pagina == "salvos") {
    carregaSalvos();
  }
}

//adiciona livros ao Firebase

function addLivro() {
  var titulo = document.getElementById("insertTit").value;
  var tituloLimpo = titulo.replace(/&|<|>|"/g, "&amp;");
  var subtitulo = document.getElementById("insertSub").value;
  var subtituloLimpo = subtitulo.replace(/&|<|>|"/g, "&amp;");
  var autor = document.getElementById("insertAut").value;
  var autorLimpo = autor.replace(/&|<|>|"/g, "&amp;");
  var categoria = document.getElementById("insertCat").value;
  var categoriaLimpa = categoria.replace(/&|<|>|"/g, "&amp;");
  var descricao = document.getElementById("insertDesc").value;
  var descricaoLimpa = descricao.replace(/&|<|>|"/g, "&amp;");
  db.collection('livros').doc().set({
    titulo: tituloLimpo,
    subtitulo: subtituloLimpo,
    autor: autorLimpo,
    categoria: categoriaLimpa,
    denuncias: 0,
    banido: false,
    descricao: descricaoLimpa,
    avaliaTot: null
  }).then((e) => {
    document.getElementById('resultCadastro').innerHTML = `${titulo} cadastrado com sucesso.`;
  }).catch(function(error) {
    document.getElementById('resultCadastro').innerHTML = `Algo deu errado, tente novamente`;
    console.log(error);
  })
};

//busca livros por categoria
function categoriaLivros(categoria){
  var referencia = db.collection('livros');
  document.getElementById('main').innerHTML = "";

  referencia.where('categoria', '==', categoria).where('banido', '==', false).orderBy('titulo').get().then(function(colecao){
    for (var msg of colecao.docs) {
      var tituloVelho = msg.data().titulo;
      if (tituloVelho.length > 20) {
        var titulo = tituloVelho.substr(0,20)+'...';
      } else {
        var titulo = tituloVelho;
      }
      var subtitulo = msg.data().subtitulo;
      console.log(subtitulo);
      if (subtitulo.length > 17) {
        console.log('grande');
        subtitulo = subtitulo.substr(0,17)+'...';
      }
      var nota = msg.data().avaliaTot;
      if (nota == null) {
        nota = 's/n'
      }
      document.getElementById("main").innerHTML += 
      `<div class=livro>
      <div class=capaLivro onclick="abreLivro('${msg.id}')">
      <div id="tituloC">${titulo}</div>
      <div id="subtituloC">${subtitulo}</div>
      <div id="descricaoC">DESCRIÇÃO COMPLETA</div>
      </p></div>
      <div class=descricao>
      <p class="autor">${msg.data().autor}</p>
      <p class="categoria">${msg.data().categoria}</p>
      <p class="nota">${nota}</p>
      </div>
      </div>`;
    }
  })
}
//abre o livro detalhado
function abreLivro(id) {
  
  console.log(id);
  var docRef = db.collection('livros');
  document.getElementById("main").innerHTML = "";
  docRef.doc(id).get().then(function(doc){
    var nota = doc.data().avaliaTot;
    if (nota == null) {
      nota = 'Sem nota'
    }
    if (nota.lenght > 3){
      nota = nota.toFixed(1);
    }
    var descricao = doc.data().descricao;
    if (descricao.length > 240) {
      descricao = descricao.substr(0,240)+'...';
    }
    document.getElementById("main").innerHTML += 
      `<div class=livroD> 
        <div class="livroSelecionado">
        <div id="tituloD">${doc.data().titulo}</div>
        <div id="subtituloD">${doc.data().subtitulo}</div>
        <div id="autorD">${doc.data().autor}</div>
        <div id="categoriaD">${doc.data().categoria}</div>
        </div>
        <div class="descricaoD">
        <div id="notaD">Nota: ${nota}</div>
        <div id="descricaoL"><p>Descrição: ${descricao}</p></div>
        </div>
        </div>

        <div class="favOuDenuncia">
        <button onclick="salva('${doc.id}')">Adicionar aos favoritos</button>
        <button onclick="denuncia('${doc.id}')">Denunciar livro</button>
        </div>

        <p id="resultado"></p>

      <div class="interacao">
        
        <input type="radio" name="nota" id="1" value="1" onclick="marca('1')" />
          <img id='estrela1' src="img/STAR.svg">
        <input type="radio" name="nota" id="2" value="2" onclick="marca('2')" />
          <img id='estrela2' src="img/STAR.svg">
        <input type="radio" name="nota" id="3" value="3" onclick="marca('3')" />
          <img id='estrela3' src="img/STAR.svg">
        <input type="radio" name="nota" id="4" value="4" onclick="marca('4')" />
          <img id='estrela4' src="img/STAR.svg">
        <input type="radio" name="nota" id="5" value="5" onclick="marca('5')" />
          <img id='estrela5' src="img/STAR.svg">
          <input type="hidden" id="notaAtual" value="0" />

        <div class="comentario">
          <textarea  id="comentario" placeholder="Deixe aqui seu comentário"></textarea>
        </div>
        <button id="avaliarD" onclick="avalia('${doc.id}');">Avaliar</button>
        <div id='feedbackAvalia'></div>
          <p>Comentários</p>
        </div>

      <div id="comentarios" >
      </div>`
      carregaComentarios(doc.id)
  });
  document.getElementById('resultadoBusca').innerHTML = '';
}

//altera a tela de login
function formcriar() {
  document.getElementById("senha2").style.display = "inline";
  document.getElementById('entraruser').style.display = "none";
  document.getElementById("criauser").innerHTML = '<button onclick="criar();">Criar usuário</button>';
  document.getElementById("criauser").style.width = '100px';
  document.getElementById('voltaentrar').style.display = 'inline';
}

//criação de usuário
function criar() {
  const email = document.getElementById("email").value;
  var emailLimpo = email.replace(/&|<|>|"/g, "&amp;");
  const senha = document.getElementById("senha").value;
  var senhaLimpa = senha.replace(/&|<|>|"/g, "&amp;");
  const senha2 = document.getElementById("senha2").value;
  var senha2Limpa = senha2.replace(/&|<|>|"/g, "&amp;");
  var favoritos = [];
  var denunciados = [];
  if (emailLimpo.includes('ifsc')) {
    if (senhaLimpa == senha2Limpa) {
      auth.createUserWithEmailAndPassword(email, senha).then(cred => {
        firebase.auth().onAuthStateChanged(user => {
          db.collection('users').doc(email).set({
            email: emailLimpo,
            favoritos: favoritos,
            denunciados: denunciados
          })
          localStorage.setItem("emailAtual", email);
          trocaPagina('home');
          localStorage.setItem('emailAtual', emailLimpo);
          document.getElementById("rodape").setAttribute('class', 'footer-ativo');
          document.getElementById("buscafixo").setAttribute('class', 'menu');
        });
      }).catch(function(error){
        var errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use'){
          document.getElementById("errouemail").innerText = "O email já está em uso";
        } else if (errorCode === 'auth/invalid-email') {
          document.getElementById("errouemail").innerText = "Email inválido";
        } else if (errorCode === 'auth/weak-password') {
          document.getElementById("erroumail").innerText = "A senha deve conter no mínimo 6 caracteres";
        } else {
          document.getElementById("errouemail").innerText = "Algo deu errado."
        }
      });
    } else {
      document.getElementById("errouemail").innerText = "As senhas não são iguais";
    }
  } else {
    document.getElementById("errouemail").innerText = "Este email não pertence ao IFSC";
  }
  
}

//login de usuário
function entrar() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  auth.signInWithEmailAndPassword(email, senha).then(cred => {
    firebase.auth().onAuthStateChanged(user => {
      localStorage.setItem("emailAtual", email);
      trocaPagina('home');
      localStorage.setItem('emailAtual', email);
      document.getElementById("rodape").setAttribute('class', 'footer-ativo');
      document.getElementById("buscafixo").setAttribute('class', 'menu');
    });
  }).catch(function(error){
    var errorCode = error.code;
  if (errorCode === 'auth/wrong-password') {
    document.getElementById("errouemail").innerText = "Senha incorreta";
  } else if (errorCode === 'auth/invalid-email') {
    document.getElementById("errouemail").innerText = "Email incorreto";
  } else {
    document.getElementById("errouemail").innerText = "Email ou senha incorretos";
  }
  })
}

//recuperação de senha
function esqueciSenha() {
  var email = document.getElementById("email").value;
  auth.sendPasswordResetEmail(email).then((e)=>{
    document.getElementById("errouemail").innerText = "Email enviado para "+email+".";
  }).catch(function(error){
    var errorCode = error.code;;
    if (errorCode ==='auth/invalid-email') {
      document.getElementById("errouemail").innerText = "Email inválido";
    } else {
      document.getElementById("errouemail").innerText = "Algo deu errado";
    }
  });
}

//mostrarSenha ao clicar no olho
function mostraSenha() {
  var type = document.getElementById('senha').type;
  if(type == 'text'){
     document.getElementById('senha').type= 'password';
  }else{
     document.getElementById('senha').type = 'text';
  }
}

//carrega os dois livros mais bem colocados pra página inicial
function carregaTop(){
  console.log('bora');
  var docRef = db.collection('livros');
  document.getElementById('top').innerHTML = "";
  docRef.where('banido', '==', false).orderBy('avaliaTot', 'desc').limit(2).get().then(function(doc){
    for (var msg of doc.docs) {
      var tituloVelho = msg.data().titulo;
        if (tituloVelho.length > 20) {
          var titulo = tituloVelho.substr(0,20)+'...';
        } else {
          var titulo = tituloVelho;
        }
        var nota = msg.data().avaliaTot;
        if (nota == null) {
          nota = 's/n'
        } else if (nota.lenght > 3) {
          nota = nota.toFixed(1);
        }

      document.getElementById("top").innerHTML += 
      `<div class="bemColocado">
        <div onclick="abreLivro('${msg.id}')">
        <p id="tituloH">${titulo}</id>
        <p id="autorH">${msg.data().autor}</id>
        
        <p id="notaH">${nota}</id>
        </div>
        <p id="salvarH" onclick="salva('${msg.id}')">SALVAR</id>
      </div>`
      //<p id="categoriaH">${msg.data().categoria}</p>
    }
  })
}

//salva livro
function salva(id){
  var emailAtual = localStorage.getItem("emailAtual");
  var docRef = db.collection('users');
  docRef.doc(emailAtual).update({
    favoritos: firebase.firestore.FieldValue.arrayUnion(id)
  }).then(function() {
    document.getElementById("resultado").innerText = "Livro salvo com sucesso";
  }).catch(function(error){
    document.getElementById("resultado").innerText = "Algo deu errado "+error;
  })
}
//carrega livros salvos
function carregaSalvos() {
  var emailAtual = localStorage.getItem("emailAtual");
  var docRef = db.collection('users');
  docRef.doc(emailAtual).get().then(function(doc){
    var favoLivros = doc.data().favoritos;
    console.log(favoLivros);
    if (favoLivros == 0){
      document.getElementById('conteudoSalvos').innerHTML = `Você não salvou nenhum livro ainda`
    } else {
      for (var livroFav of favoLivros){
        db.collection('livros').doc(livroFav).get().then(function(doc){
          var tituloVelho = doc.data().titulo;
          if (tituloVelho.length > 20) {
            var titulo = tituloVelho.substr(0,20)+'...';
          } else {
            var titulo = tituloVelho;
          }
          document.getElementById('conteudoSalvos').innerHTML += 
          `<div class="salvos" onclick="abreLivro('${doc.id}')">
          <div id="tituloS">${titulo}</div>
          <div id="subtituloS">${doc.data().subtitulo}</div>
          <div id="autorS">${doc.data().autor}</div>
          </div>`
        })
      } 
    }
    
  })
}

//buscar
function buscar(){
  var txtBusca = document.getElementById('txtBusca').value;

  if(txtBusca.length>3){
    db.collection('livros').where('banido', '==', false).get().then(function(colecao){
      document.getElementById('resultadoBusca').innerHTML = '';
      var tem = [];
        for(var doc of colecao.docs){
            if(doc.data().titulo.includes(txtBusca)){
              tem.push(doc.data());
              console.log(doc.data().titulo);
              document.getElementById('resultadoBusca').innerHTML += `
              <p onclick="abreLivro('${doc.id}')">${doc.data().titulo}</p>
              `;
            }
        } if (document.getElementById('resultadoBusca').innerHTML == ``){
          document.getElementById('resultadoBusca').innerHTML = `<p>Não há registros</p>`
        }
    })
  }
}

//Apaga as sugestões
buscafixo.addEventListener('focusout', function(){
  setTimeout(function(){document.getElementById('resultadoBusca').innerHTML = ''},200);
})

//Avaliação do livro
function marca(elRadio) {
  document.getElementById('estrela1').src = 'img/STAR.svg';
  document.getElementById('estrela2').src = 'img/STAR.svg';
  document.getElementById('estrela3').src = 'img/STAR.svg';
  document.getElementById('estrela4').src = 'img/STAR.svg';
  document.getElementById('estrela5').src = 'img/STAR.svg';
  document.getElementById('notaAtual').value = elRadio;
  console.log(elRadio);
  if (elRadio == 1) {
    document.getElementById('estrela1').src = 'img/STAR_AMARELA.svg';
  } else if (elRadio == 2){
    document.getElementById('estrela1').src = 'img/STAR_AMARELA.svg';
    document.getElementById('estrela2').src = 'img/STAR_AMARELA.svg';
  } else if (elRadio == 3) {
    document.getElementById('estrela1').src = 'img/STAR_AMARELA.svg';
    document.getElementById('estrela2').src = 'img/STAR_AMARELA.svg';
    document.getElementById('estrela3').src = 'img/STAR_AMARELA.svg';
  } else if (elRadio == 4) {
    document.getElementById('estrela1').src = 'img/STAR_AMARELA.svg';
    document.getElementById('estrela2').src = 'img/STAR_AMARELA.svg';
    document.getElementById('estrela3').src = 'img/STAR_AMARELA.svg';
    document.getElementById('estrela4').src = 'img/STAR_AMARELA.svg';
  } else if (elRadio == 5) {
    document.getElementById('estrela1').src = 'img/STAR_AMARELA.svg';
    document.getElementById('estrela2').src = 'img/STAR_AMARELA.svg';
    document.getElementById('estrela3').src = 'img/STAR_AMARELA.svg';
    document.getElementById('estrela4').src = 'img/STAR_AMARELA.svg';
    document.getElementById('estrela5').src = 'img/STAR_AMARELA.svg';
  }
}
function avalia(id){
  var id = id;
  var nota = document.getElementById('notaAtual').value;
  var comentario = document.getElementById('comentario').value;
  var comentarioLimpo = comentario.replace(/&|<|>|"/g, "&amp;");
  var avaliacao = {notas: nota, comentarios: comentarioLimpo};
  db.collection('livros').doc(id).update({
    avaliacoes: firebase.firestore.FieldValue.arrayUnion(avaliacao)
  })
  carregaComentarios(id);
  calculaAvalia(id, nota);
  document.getElementById('comentario').value = '';
  document.getElementById('feedbackAvalia').innerHTML = `Sua avaliação foi enviada.`
}

//carrega comentarios
function carregaComentarios(id){
  var titulo = id;
  document.getElementById("comentarios").innerHTML = '';
  db.collection('livros').doc(titulo).get().then(function(doc){
      var avaliacoes = doc.data().avaliacoes;
      if(avaliacoes == undefined){
        console.log('sem avalia');
        document.getElementById('comentarios').innerHTML = `<p>Este livro ainda não possui comentários.</p>`
      } else {
        for (var avalia of avaliacoes) {
          document.getElementById("comentarios").innerHTML += `
          <div class="comentario2">
          <p>Nota: ${avalia.notas}</p>
          <p>Comentário: ${avalia.comentarios}</p>
          </div>
          `
        }
      }
  })
}

//calcula nota dos livros
function calculaAvalia(id, nota){
  var id = id;
  var nota = nota;
  db.collection('livros').doc(id).get().then(function(doc){
    var quantos = doc.data().avaliacoes.length;
    if (quantos < 1) {
      var novaNota = nota;
      console.log(novaNota);
      db.collection('livros').doc(id).update({
        avaliaTot: novaNota
      });
    } else {
    console.log('quantos',quantos);
    var notaAtual = doc.data().avaliaTot;
    console.log('notaatual',notaAtual)
    var novaNota = (Number(notaAtual) * (Number(quantos) - 1) + Number(nota))/Number(quantos);
    console.log(novaNota);
    db.collection('livros').doc(id).update({
      avaliaTot: novaNota
    });
    }
  })
}
function denuncia (id){
  var id = id;
  var emailAtual = localStorage.getItem("emailAtual");
  db.collection('users').doc(emailAtual).get().then(function(doc){
    var denuncias = doc.data().denunciados;
    if (denuncias.includes(id)){
      document.getElementById("resultado").innerText = 'Você já denunciou este livro.'
    } else {
      db.collection('users').doc(emailAtual).update({
        denunciados: firebase.firestore.FieldValue.arrayUnion(id)
      })
      db.collection('livros').doc(id).get().then(function(doc){
        var denunciaQuantas = Number(doc.data().denuncias);
        var avaliacoes = doc.data().avaliacoes.lenght;
        console.log(denunciaQuantas);
        if(denunciasQuantas > 5 && denunciaQuantas > (Number(avaliacoes)/2)){
          db.collection('livros').doc(id).update({
            banido: true
          })
          console.log('banido');
        } else{
          db.collection('livros').doc(id).update({
            denuncias: Number(denunciaQuantas) + 1
          })
        }
      })
      document.getElementById("resultado").innerText = 'Livro denunciado.'
    }
  })

}