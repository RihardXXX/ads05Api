console.log(112);

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



        axios.post('/hidden', {
            password,
            email: data.email,
            path: data.path,

        })
          .then(function (response) {
            // console.log(response);
            if (response.data === 'ok') {
                message.textContent = 'Пароль изменен';
                modal.style.display = 'block';
                setTimeout(() => window.close(), 3000);
                return
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    })
});
