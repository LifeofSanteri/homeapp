function Validation(values){
    let error = {};
    const email_pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,4}$/;
    const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (values.email === ''){
        error.email = 'Sähköposti vaaditaan';
    }
    else if (!email_pattern.test(values.email)){
        error.email = 'Sähköposti on virheellinen';
    }
    else {
        error.email = '';
    }

    if (values.password === '') {
        error.password = 'Salasana vaaditaan';
    }
    else if (!password_pattern.test(values.password)) {
        error.password = 'Salasana on virheellinen';
    }
    else {
        error.password = '';
    }   
    return error;
}
export default Validation;