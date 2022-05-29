const container = document.querySelector(".container"),
      signUp = document.querySelector(".signup-link"),
      login = document.querySelector(".login-link");


    function showEye(number){
      let element = document.getElementById("togglePassword2");
      if(number ==2){
        element = document.getElementById("togglePassword3");
      }
      const password = document.querySelectorAll('.id_password');
      const type = password[number -1].getAttribute('type') === 'password' ? 'text' : 'password';
      password[number -1].setAttribute('type', type);
     if(type =='text'){
        element.classList.add('uil-eye');
        element.classList.remove('uil-eye-slash');
     }
     else {
        element.classList.remove('uil-eye');
        element.classList.add('uil-eye-slash');
     } };

    // js code to appear signup and login form
    signUp.addEventListener("click", ( )=>{
        container.classList.add("active");
    });
    login.addEventListener("click", ( )=>{
        container.classList.remove("active");
    });