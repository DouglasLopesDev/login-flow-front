var drawerToggle = document.getElementById('drawer-toggle');
var drawerMenu = document.querySelector('.drawer-menu');
var mainContent = document.querySelector('.main-content');

drawerToggle.addEventListener('change', function () {
    if (drawerToggle.checked) {
        drawerMenu.style.left = '0'; // Mostra o menu
        mainContent.style.marginLeft = "100%"; // Desloca o conteúdo principal para a direita
    } else {
        drawerMenu.style.left = '-100%'; // Esconde o menu
        mainContent.style.marginLeft = '0'; // Reposiciona o conteúdo principal
    }
});


console.log('init javascript...');
// try to select the countryCode as per the ui_locales 
var vUiLocales = getQueryStringByName("ui_locales");
// console.log(vUiLocales);
if (vUiLocales != null) {
    var res = vUiLocales.split("-")
    var defLang = res[1].toUpperCase();
    document.getElementById('countryCode').value = defLang;
}
// B2C really needs the input field to be of 'type=text' for validation to work, so therefor
// we set it to 'type=tel' when the field receives focus and set it back when focus is lost 
// on iOS, it needs to be 'type=tel' on page load for it to work, so therefor we start by setting it to that
var natNbr = document.getElementById("nationalNumber");
if (natNbr != null) {
    console.log('modifying object nationalNumber');
    natNbr.type = 'tel';
    natNbr.addEventListener('focus', onFocusInHandler, true);
    natNbr.addEventListener('blur', onFocusOutHandler, true);
}

function formatCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres que não são números
    cpf = cpf.slice(0, 11); // Limita o valor a 11 caracteres

    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona um ponto após os primeiros 3 dígitos
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona um ponto após os segundos 3 dígitos
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona um traço antes dos dois últimos dígitos

    return cpf;
}

var inputCPF = document.getElementById("signInNames.userName");
var stepTitle = document.querySelector('#StepTitle');
var inputName = document.getElementById("displayName");
var givenName = document.getElementById("givenName");
var surName = document.getElementById("surName");
var inputDateOfBirth = document.getElementById("dateOfBirth");

var cpfStep = document.getElementById("cpfStep")
var dateOfBirthStep = document.getElementById("dateOfBirthStep")
var nameStep = document.getElementById("nameStep")
var inputPhoneNumber = document.getElementById("strongAuthenticationPhoneNumber")
var checkboxTermOfUse = document.getElementById("termsOfUse_true")
var migrationMessageTitle = document.getElementById("migrationMessageTitle")

// troca de texto do botão continuar para próximo
var buttonContinue = document.getElementById("continue")
if (buttonContinue != null) {
    buttonContinue.textContent = "Próximo";
}

function continueToNextStep(nextStep, input) {
    if (!nextStep) {
        buttonContinue.classList.add("disableButton")
        document.querySelector('.LabelError').style.display = 'flex';
        if (input) input.classList.add("inputInvalid")
    }
    else {
        buttonContinue.classList.remove("disableButton")
        document.querySelector('.LabelError').style.display = 'none';
        if (input) input.classList.remove("inputInvalid")

    }
}

function handleStepField(fieldInput, placeholder, innerText) {
    if (placeholder) fieldInput.placeholder = placeholder;
    if (innerText) stepTitle.innerHTML = innerText;

}

function addLabelErrorAfterend(errorText, afterTo) {

    var labelError = document.createElement("p")
    labelError.innerText = errorText
    labelError.classList.add("LabelError")
    afterTo.insertAdjacentElement('afterend', labelError);

}

function switchStepper(step) {
    switch (step) {
        case "step1":
            document.getElementById("cpfStep").classList.add("mobile-stepper-dot-selected")

            break;
        case "step2":
            cpfStep.classList.remove("mobile-stepper-dot-selected")
            dateOfBirthStep.classList.add("mobile-stepper-dot-selected")

            break;
        case "step3":
            dateOfBirthStep.classList.remove("mobile-stepper-dot-selected")
            nameStep.classList.add("mobile-stepper-dot-selected")

            break;

        default:
            break;
    }
}

function formatPhoneNumber(value) {

    if (value.length >= 3) value = value.substr(3)
    else value = ""
    // Remove tudo que não for número
    let phoneNumber = value.replace(/\D/g, '');
    phoneNumber = phoneNumber.slice(0, 11);

    // Adiciona os parênteses e o hífen
    phoneNumber = phoneNumber.replace(/^(\d{2})(\d)/g, '($1) $2');
    phoneNumber = phoneNumber.replace(/(\d)(\d{4})$/, '$1-$2');

    // Define o novo valor do campo
    return "+55" + phoneNumber;
}

function handleSurnameEGivenName(displayName) {

    var nameArray = displayName.split(" ");

    givenName.value = nameArray[0]

    if (nameArray.length > 1) surName.value = displayName.replace(nameArray[0] + " ", "")
}

// tratamentos relacionados ao campo cpf
if (inputCPF != null) {
    if (inputCPF.offsetParent !== null) {

        handleStepField(inputCPF, "Ex. 123.456.789-01", "Por favor, digite seu CPF para iniciar o cadastro.")

        //Label error
        addLabelErrorAfterend("O número de CPF parece não estar correto", inputCPF)

        switchStepper("step1")

        // Função que verifica se há erros no CPF
        inputCPF.addEventListener('input', () => {
            inputCPF.value = formatCPF(inputCPF.value);
            const cpf = inputCPF.value;
            continueToNextStep(validCPF(cpf), inputCPF);

        });
    }
}

if (inputPhoneNumber != null) {
    if (inputPhoneNumber.offsetParent !== null) {
        buttonContinue.classList.add("disableButton")

        handleStepField(inputPhoneNumber, "Ex. (99) 99123-4567", null)

        inputPhoneNumber.addEventListener('input', () => {
            inputPhoneNumber.value = formatPhoneNumber(inputPhoneNumber.value);
            continueToNextStep((inputPhoneNumber.value.length == 18 && checkboxTermOfUse.checked), inputPhoneNumber)
        });
    }
}

if (migrationMessageTitle != null) {
    if (migrationMessageTitle.offsetParent !== null) {
        switchStepper("step1")
        migrationMessageTitle.classList.add("StepTitle")
    }
}

// tratamentos relacionados ao campo nome
if (inputName != null) {
    if (inputName.offsetParent !== null) {

        var lastDigitsPhone = document.getElementById("hiddenDigitsPhone")
        var stepsMessage = "Falta pouco para concluir seu cadastro"

        if (lastDigitsPhone != null && lastDigitsPhone.offsetParent !== null && lastDigitsPhone.value) {
            stepsMessage = "Preencha o número do seu celular cadastrado " + lastDigitsPhone.value + ". Assim, enviaremos um código de verificação."

            document.getElementById("displayName_label").style.display = 'none'
            document.getElementById("displayName").style.display = 'none'

            inputPhoneNumber.value = ""

        }
        lastDigitsPhone.style.display = 'none'
        givenName.style.display = 'none'
        document.getElementById("givenName_label").style.display = 'none'
        document.getElementById("surName_label").style.display = 'none'
        surName.style.display = 'none'

        inputName.addEventListener('input', () => {
            handleSurnameEGivenName(inputName.value)
        })

        handleStepField(inputName, "Ex. João da Silva", stepsMessage)

        switchStepper("step3")

    }
}

if (checkboxTermOfUse != null) {
    var labelToTermOfUse = document.querySelectorAll('label[for="termsOfUse_true"]');

    labelToTermOfUse[0].innerHTML = "Eu aceito os <a href='#' title='Termos de Uso'>Termos de Uso</a> (obrigatório)"
    checkboxTermOfUse.addEventListener('change', function () {
        continueToNextStep((inputPhoneNumber.value.length == 18 && checkboxTermOfUse.checked), null)
    });
}

if (checkboxTermOfUse != null && checkboxTermOfUse.offsetParent !== null) {
    buttonContinue.classList.add("disableButton")
}

// tratamentos relacionados ao campo dataDeNascimento
if (inputDateOfBirth != null) {
    if (inputDateOfBirth.offsetParent !== null) {
        var stepsMessage = "Agora, digite sua data de nascimento para continuar."
        var nameToMessageSignIn = document.getElementById("displayNameRegistered")

        if (nameToMessageSignIn != null && nameToMessageSignIn.offsetParent !== null && nameToMessageSignIn.value) {
            stepsMessage = "Olá, <b>" + nameToMessageSignIn.value + "!</b> Encontramos o seu cadastro. Agora, confirme a sua data de nascimento."
        }
        nameToMessageSignIn.style.display = 'none'


        handleStepField(inputDateOfBirth, null, stepsMessage)

        switchStepper("step2")
    }
}

function isValidCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf == null) {
        return false;
    }

    if (cpf.length != 11) {
        return false;
    }

    if ((cpf == '00000000000') || (cpf == '11111111111') || (cpf == '22222222222') || (cpf == '33333333333') || (cpf == '44444444444') || (cpf == '55555555555') || (cpf == '66666666666') || (cpf == '77777777777') || (cpf == '88888888888') || (cpf == '99999999999')) {
        return false;
    }

    let numero = 0;
    let caracter = '';
    let numeros = '0123456789';
    let j = 10;
    let somatorio = 0;
    let resto = 0;
    let digito1 = 0;
    let digito2 = 0;
    let cpfAux = '';

    cpfAux = cpf.substring(0, 9);

    for (let i = 0; i < 9; i++) {
        caracter = cpfAux.charAt(i);
        if (numeros.search(caracter) == -1) {
            return false;
        }
        numero = Number(caracter);
        somatorio = somatorio + (numero * j);
        j--;
    }

    resto = somatorio % 11;
    digito1 = 11 - resto;

    if (digito1 > 9) {
        digito1 = 0;
    }

    j = 11;
    somatorio = 0;
    cpfAux = cpfAux + digito1;

    for (let i = 0; i < 10; i++) {
        caracter = cpfAux.charAt(i);
        numero = Number(caracter);
        somatorio = somatorio + (numero * j);
        j--;
    }

    resto = somatorio % 11;
    digito2 = 11 - resto;

    if (digito2 > 9) {
        digito2 = 0;
    }

    cpfAux = cpfAux + digito2;

    if (cpf != cpfAux) {
        return false;
    }

    else {
        return true;
    }
}

function validCPF(value) {
    if (value && value !== "" && value.length === '000.000.000-00'.length && isValidCPF(value)) return true
    return false
}

function onFocusInHandler(e) {
    console.log('onFocusInHandler'
    );
    var natNbr = document.getElementById("nationalNumber");
    natNbr.type = 'tel';
    console.log(natNbr.type);
}
function onFocusOutHandler(e) {
    console.log('onFocusOutHandler');
    var natNbr = document.getElementById("nationalNumber");
    natNbr.type = 'text';
    console.log(natNbr.type);
}
function getQueryStringByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}