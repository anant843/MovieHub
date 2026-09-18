export const dataValidation = (email,password) =>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

 

    if (!email || !password ) {
        return "Username and Email and Password are required.";
    }

    if (!emailRegex.test(email)) {
        return "Invalid email format.";
    }

    if (!passwordRegex.test(password)) {
        return "Password must be at least 8 characters long and contain at least one letter and one number.";
    }

    return null;

}