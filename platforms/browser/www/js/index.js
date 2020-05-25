document.addEventListener("inicio", executaAcao);

function executaAcao() {
    console.log("Scripts de index.html");
}

function pageHome() {
  var elementoAtual = document.getElementById("templateHome");
  var template = document.importNode(elementoAtual.content, true);
  document.getElementById("main").innerHTML = "";
  document.getElementById("main").appendChild(template);

}
function pageCadastro() {
  var elementoAtual = document.getElementById("templateCadastro");
  var template = document.importNode(elementoAtual.content, true);
  document.getElementById("main").innerHTML = "";
  document.getElementById("main").appendChild(template);

}
function pageLogin() {
  var elementoAtual = document.getElementById("templateLogin");
  var template = document.importNode(elementoAtual.content, true);
  document.getElementById("main").innerHTML = "";
  document.getElementById("main").appendChild(template);

}
class livro {
  constructor(){
      this.titulo="";
      this.autor="";
  }
}
var livros = [];
function addLivro() {
  document.getElementById("insertTit").innerText ;
  var novoLivro = new livro();
  novoLivro.titulo = document.getElementById("insertTit").innerText;
  novoLivro.autor = document.getElementById("insertAut").innerText ;
  
  livros.push(novoLivro);
  //esse push vai mudar como firebase
}
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  firebase.auth().signInWithPopup(provider)
      
          .then(result => {
              const user = result.user;        
          })  
}