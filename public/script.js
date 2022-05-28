const container = document.querySelector(".container"),
//       pwShowHide = document.querySelectorAll(".showHidePw"),
//       pwFields = document.querySelectorAll(".password"),
      signUp = document.querySelector(".signup-link"),
      login = document.querySelector(".login-link");

//     //   js code to show/hide password and change icon
//     pwShowHide.forEach(eyeIcon =>{
//         eyeIcon.addEventListener("click", ()=>{
//             pwFields.forEach(pwField =>{
//                 if(pwField.type ==="password"){
//                     pwField.type = "text";

//                     pwShowHide.forEach(icon =>{
//                         icon.classList.replace("uil-eye-slash", "uil-eye");
//                     })
//                 }else{
//                     pwField.type = "password";

//                     pwShowHide.forEach(icon =>{
//                         icon.classList.replace("uil-eye", "uil-eye-slash");
//                     })
//                 }
//             }) 
//         })
//     })
    
function showEye(number){
    var element = document.getElementById("togglePassword"+"");
  if(number ==2){

    element = document.getElementById("togglePassword2");

  }
  else if(number ==3){

    element = document.getElementById("togglePassword3");

  }
   const password = document.querySelectorAll('.id_password');

 const type = password[number -1].getAttribute('type') === 'password' ? 'text' : 'password';
 password[number -1].setAttribute('type', type);
 if(type =='text'){
    element.classList.add('uil-eye');
    element.classList.remove('uil-eye-slash');
    //.removeClass('uil-eye-slash');
 }
 else {
    element.classList.remove('uil-eye');
    element.classList.add('uil-eye-slash');
 }
 

 };        
 
    // js code to appear signup and login form
    signUp.addEventListener("click", ( )=>{
        container.classList.add("active");
    });
    login.addEventListener("click", ( )=>{
        container.classList.remove("active");
    });