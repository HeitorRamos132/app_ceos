class Aplicativo {
    constructor() {
        document.addEventListener('deviceready', this.onDeviceReady);
    }
    onDeviceReady() {
        console.log('Received Event: deviceready');
        document.dispatchEvent(new Event("inicio"));
    }
}

var app = new Aplicativo();