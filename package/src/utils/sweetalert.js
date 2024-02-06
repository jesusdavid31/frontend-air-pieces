import Swal from 'sweetalert2';

const chargingData = () => {
  Swal.fire({
      title: 'Cargando',
      html: 'Por favor espera un momento...',
      showCancelButton: false,
      showConfirmButton: false, 
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
  });
}

const savingData = () => {
  Swal.fire({
      title: 'Guardando',
      html: 'Por favor espera un momento...',
      showCancelButton: false,
      showConfirmButton: false, 
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
  });
}

const sweetalert = (title, text) => {
  return Swal.fire({
    title,
    html: text,
    showCancelButton: false,
    showConfirmButton: false, 
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading()
    }
  });
}

const pageLoadError = () => {
  return Swal.fire({
    icon: 'error',
    title: 'Error',
    text: 'Hubo un error al cargar los datos, por favor intenta nuevamente',
    allowOutsideClick: false,
    showCancelButton: false,
    showConfirmButton: false, 
  });
}

export {
  chargingData,
  savingData,
  sweetalert,
  pageLoadError
}
