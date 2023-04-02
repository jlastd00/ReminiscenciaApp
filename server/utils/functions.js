export const toMayus = (text) => text.toUpperCase();

export const toMinus = (text) => text.toLowerCase();

export const print = (text) => console.log(text);

export const printError = (error) => console.error(toMayus(error.name) + ": " + error.message);

export const generarErrorResponse = (error) => {
    return {
        resultado: "ERR",
        mensaje: error.message
    }
}

export const generarOkResponse = (msj, data) => {
    return {
        resultado: "OK",
        mensaje: msj,
        data
    }
}

export const randomName = () => {
    const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randName = "";
    for (let i = 0; i < 8; i++) {
        randName += possible.charAt(Math.floor(Math.random() * possible.length));
    };
    return randName;
}
