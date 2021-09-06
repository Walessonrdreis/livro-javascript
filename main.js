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
  var zipecode = document.getElemenById("zipcode");
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
