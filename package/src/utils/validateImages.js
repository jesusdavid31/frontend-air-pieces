const validateImageSize = ( file ) => {

    let invalid = false;

    // Validar tamaño del archivo a subir, es de 5MB como maximo
    if ( file.size > 5000000 ) {
        // TRUE es para indicar que el tamaño del archivo subido no es permitido
        invalid = true;
    }

    return invalid;

}

const validateImageExtension = ( file ) => {
    let invalid = false;
    const cutName = file.name.split('.');
    const fileExtension = cutName[cutName.length - 1];
    // Validar extension
    const validExtensions = ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'];
    if (!validExtensions.includes(fileExtension)) {
        // True es para indicar que la extensión no es permitida
        invalid = true;
    }
    return invalid;
}

const validateExcelFileSize = ( file ) => {

    let invalid = false;

    // Validar tamaño del archivo a subir, es de 5MB como maximo
    if ( file.size > 5000000 ) {
        // TRUE es para indicar que el tamaño del archivo subido no es permitido
        invalid = true;
    }

    return invalid;

}

const validateExcelFileExtension = ( file ) => {
    let invalid = false;
    const cutName = file.name.split('.');
    const fileExtension = cutName[cutName.length - 1];
    // Validar extension
    const validExtensions = ['xlsx', 'XLSX'];
    if (!validExtensions.includes(fileExtension)) {
        // True es para indicar que la extensión no es permitida
        invalid = true;
    }
    return invalid;
}

export {
    validateImageSize,
    validateImageExtension,
    validateExcelFileSize,
    validateExcelFileExtension
}