console.log(112);
const axios = require('axios');

window.addEventListener('DOMContentLoaded', (event) => {


    const modal = document.getElementById('myModal');
    const message = document.querySelector('.message');
    const close = document.querySelector('.close');

    close.addEventListener('click', () => modal.style.display = 'none');


    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    const form = document.forms.my;

    form.addEventListener('submit', e => {
        e.preventDefault();
        
        const password = form.elements.password.value.trim();
        const repeatPassword = form.elements.repeatPassword.value.trim();

        if (!password || !repeatPassword) {
            message.textContent = 'Не заполнены поля для пароля';
            modal.style.display = 'block';
            return
        }

        if (password !== repeatPassword) {
            message.textContent = 'поле пароль и повторить паролль не совпадают';
            modal.style.display = 'block';
            return
        }



        const newData = { ...data, password };

        axios.post('/user', newData)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    })
});
