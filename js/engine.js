// JavaScript Document

$(document).ready(function(e) {
    $('#ExemploModalCentralizado').modal({ show: false});
   	document.getElementById('inputsalario').addEventListener('keypress', keyEnter);
   	document.getElementById('inputsalario').addEventListener('focus', function(event) {
   		$('#inputsalario').val('');
   	});

   	$('#tabulacao a').on('click', function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	});
});

function calcula(event) {
	event.preventDefault();
	$(event.target).blur();
	const regex  = /^\d+(?:\,\d{0,2})?$/;

	var inputString = document.getElementById('inputsalario').value;
	
	if (!regex.test(inputString)) return;
	
	const salario = parseFloat(inputString.replace(",", "."));

	const reducao = parseInt($("input[name='reducaoRadio']:checked").val(), 10);

	// Valida se a reducao esta predefinida
	if(  ([25, 50 , 70, 100].indexOf(reducao) == -1) ) return false;
	
	/****** faixa 1 do seguro desemprego *******/
	const faixa1 = 1599.62;
	const taxa1 = 0.8; // 80% do salario medio para primeira faixa

	/****** faixa 2 do seguro desemprego *******/
	const faixa2 = 2666.29;
	const taxa2 = 0.5; // 50% para segunda faixa + adicao de 1279.69
	const adicao2 = 1279.69;

	/****** faixa 3 do seguro desemprego *******/
	const faixa3 = 2666.29;
	const recebimento3 = 1813.03; // Invariavelmente 1813.03

	const salarioMinimo = 1045.00;

	var seguroDesemprego = 0;
	var contribuicaoEmpresa = 0;
	var contribuicaoGoverno = 0;
	var totalRecebido = 0;


	/******* Contribuicao da empresa ********/
	contribuicaoEmpresa = salario*((100-reducao)/100);


	/****** Contribuicao do governo ********/

	// Calculo do seguro desemprego
	if (salario < faixa1) { // Ate 1599.61
		seguroDesemprego = salario*taxa1;
		console.log("faixa 1");
	} else if ((salario >= faixa1) && (salario <= faixa2)) { //Entre 1599.62 e 2666.29
		seguroDesemprego = (salario-faixa1)*taxa2 + adicao2;
		console.log("faixa 2");
	} else { // Acima de 2666.29
		seguroDesemprego = recebimento3;
		console.log("faixa 3");
	}

	// Limita a parcela ao valor do salario mínimo
	seguroDesemprego = Math.max(salarioMinimo, seguroDesemprego);

	contribuicaoGoverno = seguroDesemprego*(reducao/100);

	// Verifica se o salario recebido fica abaixo do salario minimo
	const diferencaParaMinimo = salarioMinimo - (contribuicaoGoverno+contribuicaoEmpresa);

	// Ajusta contribuicao do governo para recompor a diferenca e atingir o salario minimo
	contribuicaoGoverno += (diferencaParaMinimo > 0) ? diferencaParaMinimo : 0; 
	

	totalRecebido = contribuicaoGoverno+contribuicaoEmpresa;
	
	
	
	document.getElementById("contribuicao-empresa").innerHTML = formatNumber(contribuicaoEmpresa);
	document.getElementById("contribuicao-governo").innerHTML = formatNumber(contribuicaoGoverno);
	document.getElementById("recebimento").innerHTML = formatNumber(totalRecebido);
	document.getElementById("reducao").innerHTML = reducao;


	$('#ExemploModalCentralizado').modal('show');
	
}

function keyEnter(event) {
	if (event.keyCode === 13) {
	    event.preventDefault();
        document.getElementById("btCalcula").click();
  }
}

function formatNumber(valor) {
	var truncado = Math.floor(Number(valor)*100)/100;
	var string  = Number(truncado).toFixed(2);
	var tokens = string.split('.');
	
	var mantica = tokens[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
	var ordenada = tokens[1];

	return [mantica, ordenada].join(',');
}

function formatPercent(valor) {
	
	var string  = Number(valor.toFixed(2)).toString();
	var output = string.replace('.', ',');
	
	return output;
}