/*
*Estes é um script que deifne a função calculate() chamads pelas as rotinas  de tratamento de eventos
*No index do html.  afunção lê valores de elementos input, calcula
*as informações de pagamentode empréstimo, exibe o resulatado em elementos <span>.
*Também salva os dados do usuário, exibe links para finaceiras e desenha um gráfico.
 */

function calculate(){
  //pesquisa os elementos de entrada e saída no documento
  var amount = document.getElemenById("amount");
  var apr = document.getElementById("apr");
  var years = document.getElementById("years");
  var zipcode = document.getElemenById("zipcode");
  var payment = document.getElementById("payment");
  var total = document.getElementById("total");
  var totalinterest = document.getElementById("totalinterest");

  //Obtém a entrada do usuário através dos elementos de entrada. Presume que tudo isso 
  //é valido
  //Converte os juros de porcentagem para decimais e converte de taxa
  //anual para taxa mensal. Converte o período de pagamento em anos
  //para o número de pagamentos mensais.
  var principal = parseFloat(amount.value);
  var interest = parseFloat(apr.value) / 100 /12;
  var payments = parseFloat(years.value) * 12;

  //Agora calcula o valor do pagamento mensal.
  var x = math.pow(1 + interest, payments);// math.pow calcula potências
  var monthly = (principal*x*interest)/(x-1);

  //Se o resultado é um número finito, a entrada do usuário estava correta e 
  //temos resultados significativos para exibir
  if (isFinite(monthly)) {
    //Preenche os campos de saída, arredondando para 2 casas decimais
    payment.innerHTML = monthly.toFixed(2);
    total.innerHTML = (monthley*payments).toFixed(2);
    totalinterest.innerHTML =((monthly*payments)-principal).toFixed(2);

    //Salva a entrada do usuário para que possamos recuperá-la na próxima vez que
    //ele visitar
    save(amount.value, apr.value, years.value, zipcode.value);

    //Anúncio: localiza e exibe financeiros locais, mas ignora erros de rede
    try {//Captura quaiquer erros que ocorrem dentro destas chaves
      getLenders(amount.value, apr.value, years.value, zipcode.value);
    }
    catch(e) {/* E ignora esses erros */}

    // por fim, traça o gráfico de saldo devedor, dos juros e dos pagamentos do capital
    chart(principal, interest, monthly, payments);
  }
  else {
    //O resultado for Not-a-Number ou infinito, o que significa que a entrada do usuário
    // Estav incompleta ou era inválida. Apaga qualquer saída exibida anteriormente.
    payments.innerHTML =""; //Apaga o conteúdo desses elementos
    total.innerHTML="";
    totalinterest.innerHTML ="";
    chart(); //sem argumentos, apaga o gráfico
  }
}

// salva a entrada do usuario como propriedade do objeto localStorage. Essas
//propriedades ainda existirão quando o usuário visitar no futuro
//Esse recursi de armazenamento não vai fucionar em alguns navegadores (o firefox, por
//exemplo), se você exucutar o exemploa apartir de uma arquivo local:// URL. Conteudo,
//funciona com HTTP.
function save(amount, apr, years, zipcode){
  if (window.localStorage) {//Só faz isso se o navegador suportar
    localStorage.loan_amount = amount;
    localStorage.loan_apr = apr;
    localStorage.loan_years = years;
    localStorage.loan_zipcode = zipcode;

  }
};

//Tenta restaurar os campo automaticamente quando odocumento é carregado
//pela primeira vez
window.onload = function(){
  // se o navegador suporta o localStorage e temos alguns dados armazenados
  if (window.localStorage && localStorage.loan_amount) {
document.getElementById("amount").value = localStorege.loan_amount;
document.getElementById("apr").value = localStorage.loan_apr;
document.getElementById("years").value = localStoraage.loan_years;
document.getElementById("zipcode").value = localStorage.loan_zipcode;
  }
};
//Passa a entrada so usuario para um script no lado do servidor (teoricamente) pode
//retornar
//uma lista de linkspara financeiras locaisinteressadas em fazer empréstimos. Este 
//exemplo não contém uma implementação real desse serviço de busca de financeiras. Mas 
// se o serviço exixtisse, essa função funcionaria com ele.
function getLenders(amount, apr, years, zipcode){
//Se o navegador não suportar XMLHttpRequest, não faz nada
if(!window.XMLHttpRequest) return;
//localiza o elemento para exibir a lista de finaceiras
var ad = document.getElementById("lenders");
if(!ad) return;
//Codifica a entrada do usuário como parâmetros de consulta em um URL
var url = "getLenders.php" +          //Url do serviço +
"?amt=" + encodeURIComponent(amount) +           //dados do usuário na String de consulta
"&apr=" + encodeURIComponent(apr) +
"yrs="+ encodeURIComponent(years) +
"zip=" + encodeURIComponent(zipcode);

//Busca conteúdo desse URL usando o objeto XMHttpRequest
var req = new XMHttpRequest()  //Inicia um nvo pedido
req.open("GET",url); //Um pedido GEt da HTTP para o url
req.send(null); //Envia um pedido sem corpo

//Antes de retornar, registra uma função de rotina de tratamento de evento que será
//chamada no momento posterior, quando a resposta do servidor de HTTP chegar
//Esse tipo de programação assíncrona é muito comum em JavaScript do lado do cliente.
req.onreadystatechage = function(){
  if (req.readyState == 4 && req.status == 200) {
    //Se chegamos até aqui, obtivemos uma respostaHTTp válida  e completa
    var response = req.responseText; //Resposta HTTP como string
    var lenders = JSON.parse(response);//Analisa em um arry JS

    //Converte o array de objetos lender uma string html
    var list = "";
    for(var i = 0; i <lenders.length; i++) {
      list +="<li><a href=' " + lenders[i].url + " ' > " + 
      lenders[i].name + "</a>";
    }
    //Exibe o código HTML no elemento acima.
    ad.innerHTML = "ul" + list + "</ul>" ; 
  }
}
}

//Gráfico do saldo devedor mensal, dos juros e do capital em um elemento <canvas>
//da HTML.
//Se for chamado sem argumentos, basta apagar qualquer gráfico desenhado anteriormente
function chart(principal, interest, monthly, payments) {
  var graph = document.getElementById("graph"); //obtém a marca <canvas>
  graph.width = graph.width;  //Mágica para apagar e redefinir o elemento
                               //canvas
//Se chamamos sem argumento ou se o navegador não suporta
//Elementos gráficos em um elemento <canvas>, basta retornar agora.
if (arguments.length == 0 || graph.getContetex) return;   

//obtêm o objeto "contexto" de <canvas> que define a API de desenho
var g = graph.getContetex("2d"); // Todo desenho é feito com ese objeto
var width  = graph.width, height = graph.height; // Obtêm o tamanho da tela de 
//desenho

// Essa funções convertem números de pagamento e valores monetários em pixels
function paymentToX(n){return n * width/payments;}
function amountToY(a){return height-(a*height/(monthly*payments*1.05));}

//Os parêmetros são uma linha reta (0,0) a (payments, monthly*payments)
g.moveTo(paymentToX(0), amountToY(0)); //Começa no canto inferior esquerdo
g.lineTo(paymentToX(payments), // Desenha até o canto superior direito
               amountToY(monthly*payments));
g.lineTo(paymentToX(payments), amountToY(0)); //Para baixo, até o canto
                           //inferior direito
g.closePath(); //   E volta ao início
g.fillStyle = "#f88";Vermelho-claro
g.fill();  //Preenche o triangulo
g.font = "bold 12px sans-serif"; //Define a fonte
g.fillText("Total Interest Payments", 20,20); //desenha o texto na legenda

//O capital acumulado não é linear e é mais complicado de reprentar no gráfico 
var equity = 0;
g.beginPath(); //Inicia uma nova figura
g.moveTo(paymentToX(0), amountToY(0)) //começa no canto inferior 
                           //esquerdo
for (var p = 1; p <= payments; p++) {
  //Para cada pagamento descobre quanto é o juros
  var thisMonthsInterest = (principal-equity) * interest;
  equity += (monthly - thisMonthsInterest); // O esto vai para o capital
  g.lineTo(paymentToX(0),amountToY(0)); // Linha até este ponto
}                           
g.lineTo(paymentToX(payments), amountToY(0));// Linha de volta para o eixo x
g.closePath(); // E volta par ao ponto inicial
fillStyle = "green"; // agora usa cor verde
g.fill(); // E preenhe a área ob a curva
g.fillText("Total Equity", 20,35); // Rotula em verde

// Faz laço novamente, acomo acima, mas representa o saldo devedor como um alinha
//preta grossa no gráfico
var bal = principal;
g.beginPath();
g.moveTo(paymentToX(0), amountToY(bal));
for(var p = 1; p <= payments; p++) {
  var thisMonthsInterest = bal*interest;
  bal-= (monthly- thisMonthsInterest); // O resto vai par ao capital
  g.lineTo(paymentToX(p), amountToY(bal)); // Desnha a linha até esse ponto
}
g.lineWidth = 3; //Usa uma linha grossa
g.stroke(); // Desnha a curva de saldo
g.fillStyle = "black"; // Troca para texto Preto
g.fillText("Loan Balnce", 20,50); // Entrada de legenda

// agora faz marcações anuais e os números de ano no eixo x
g.textAlign= "center";
var y = amountToY(0); // Coordena y do eixo x
for(var year=1; year*12 <= payments; year++) { // para cada ano
  var x = paymentToX(year*12); // Calcula a posição da marca
  g.fillRect(x-0.5,y-3,1,3); // Desenha a marca
  if (year ==1) g.fillText("year", x,y-5); // Rotula o eixo
  if (year % 5 == 0 && year*12 !==payments) // Numera acada 5 anos
  g.fillText(String(year),x, y-5);
}

// Marca valores de pagamento ao longo da marcadireita
g.textAlign = "right"; // Alinha o texto à direita
g.textBaseline = "middle"; // Centraliza verticalmente
var ticks = [monthly*payments, principal]; // Os dois pontos que marcaremos 
var rightEdge = paymentToX(paymentes); // Coordena x do eixo y
for(var i = 0; i < ticks.length; i++) {// para um dos dois pontos
  var y = amountToY(ticks[1]); // Calcula a posição y da marca
  g.fillRect(rightEdge-3, y-0.5, 3,1); // Desenha a marcação
  g.fillText(String(ticks[i].toFixed(0))), // e a rotula
               rightEdge-5, y
}
}