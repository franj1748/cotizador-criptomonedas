const currencySelect = document.querySelector('#moneda');
const cryptoSelect   = document.querySelector('#crypto');
const form           = document.querySelector('#formulario');
const quote          = document.querySelector('#quote');
const info           = document.querySelector('#information');
const searchValue    = {
    currency: '',
    crypto: ''
}

document.addEventListener('DOMContentLoaded', () => {

    getCurrency();
    getCrypto();

    form.addEventListener('submit', quoteCrypto);
    currencySelect.addEventListener('change', readValue);
    cryptoSelect.addEventListener('change', readValue);

});

function getCurrency() {
    
    const url = 'data/countries.json'
    fetch(url)
    .then(response => response.json())
    .then(data => fillSelectCurrency(data))
}

function getCrypto() {
    
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=15&tsym=USD'
    fetch(url)
    .then(response => response.json())
    .then(data => fillSelectCrypto(data))
}


function fillSelectCurrency(countries) {
    
    countries.forEach(countryData => {

        const {country, CurrencyCode, CurrencyName} = countryData;

        const option = document.createElement('option');
        option.value = CurrencyCode;
        option.textContent = `${CurrencyName} - ${country}`;

        currencySelect.appendChild(option);
        
    });
}

function fillSelectCrypto(cryptosData) {
    
    const cryptos = cryptosData.Data;
    cryptos.forEach(crypto => {

        const {FullName, Name} = crypto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        cryptoSelect.appendChild(option);
        
    }); 
}

function readValue(e) {
    
    searchValue[e.target.name] = e.target.value;

}

function quoteCrypto(e) {

    e.preventDefault();

    const {crypto, currency} = searchValue;
    if (crypto == '' || currency == '') {
        mostrarAlerta('Error!', 'Todos los campos son obligatorios', 'error', 'Cerrar');
        return;
    }

    queryAPI();
}

function queryAPI() {

    const {crypto, currency} = searchValue;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${currency}`;

    info.classList.add('animate__animated', 'animate__fadeOut');
    setTimeout(() => {

        fetch(url)
        .then(response => response.json())
        .then(data => printHTML(data.DISPLAY[crypto][currency]))

    }, 1200);
}

function printHTML(display) {
    
    const {IMAGEURL, PRICE, LASTUPDATE, SUPPLY, OPENDAY, VOLUMEDAYTO, HIGHDAY, LOWDAY, CHANGE24HOUR, CHANGEPCT24HOUR} = display;
    const {crypto} = searchValue;
    
    quote.classList.add('animate__zoomIn');

    quote.innerHTML = `
                <div class="col-md-6 px-2 animate__animated animate__fadeIn">
                    <div class="h-100 p-3 text-white bg-dark d-flex flex-column justify-content-center align-items-center">
                        <img src="https://www.cryptocompare.com${IMAGEURL}" class="img-fluid" width="100" height="100" alt="Img Crypto Currency">
                        <h2>Precio actual:</h2>
                        <p class="fw-bold fs-3">${PRICE}</p>
                        <a href="https://www.cryptocompare.com/coins/${crypto}/overview" class="btn btn-outline-light" type="button" target="_blank">Ver más</a>
                    </div>
                </div>
                <div class="col-md-6 px-2 animate__animated animate__fadeIn">
                    <div class="list-group rounded-0">
                        <a href="#" class="pe-none bg-dark text-white text-center list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                            <div class="d-flex gap-2 w-100 justify-content-around">
                                <div>
                                    <h6 class="mb-0">Ultima actualización</h6>
                                    <p class="mb-0 opacity-75">${LASTUPDATE}</p>
                                </div>
                            </div>
                        </a>
                        <a href="#" class="pe-none bg-dark text-white text-center list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                            <div class="d-flex gap-2 w-100 justify-content-around">
                                <div>
                                    <h6 class="mb-0">Supply</h6>
                                    <p class="mb-0 opacity-75">${SUPPLY}</p>
                                </div>
                            </div>
                        </a>
                        <a href="#" class="pe-none list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                            <ion-icon name="analytics-outline" style="font-size: 30px;"></ion-icon>
                            <div class="d-flex gap-2 w-100 justify-content-around">
                                <div>
                                    <h6 class="mb-0">Apertura del día:</h6>
                                    <p class="mb-0 opacity-75">${OPENDAY}</p>
                                </div>
                                <div class="vr"></div>
                                <div>
                                    <h6 class="mb-0">Volumen del día:</h6>
                                    <p class="mb-0 opacity-75">${VOLUMEDAYTO}</p>
                                </div>
                            </div>
                        </a>
                        <a href="#" class="pe-none list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                            <ion-icon name="swap-vertical-outline" style="font-size: 25px;"></ion-icon>
                            <div class="d-flex gap-2 w-100 justify-content-around">
                                <div>
                                    <h6 class="mb-0">Precio más alto:</h6>
                                    <p class="mb-0 opacity-75">${HIGHDAY}</p>
                                </div>
                                <div class="vr"></div>
                                <div>
                                    <h6 class="mb-0">Precio más bajo:</h6>
                                    <p class="mb-0 opacity-75">${LOWDAY}</p>
                                </div>
                            </div>
                        </a>
                        <a href="#" class="pe-none list-group-item list-group-item-action d-flex gap-3 py-3" aria-current="true">
                            <ion-icon name="trending-up-outline" style="font-size: 25px;"></ion-icon>
                            <div class="d-flex gap-2 w-100 justify-content-around">
                                <div>
                                    <h6 class="mb-0">Variación 24H:</h6>
                                    <p class="mb-0 opacity-75">${CHANGE24HOUR}</p>
                                </div>
                                <div class="vr"></div>
                                <div>
                                    <h6 class="mb-0">Variación 24H:</h6>
                                    <p class="mb-0 opacity-75">${CHANGEPCT24HOUR}%</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>`

}

function mostrarAlerta(titulo, mensaje, tipo, btn){
	swal({
		title: titulo,
		text: mensaje,
		icon: tipo,
		button: btn,
		closeOnClickOutside: false,
		closeOnEsc: false,
	});
}


