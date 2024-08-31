// importa o axios para fazer as requisições para o back

const Notificantion = async ({notification,header, body}) => {
    const dados_notification = {
        title: header,
        icon: "https://app.okwhats.com.br/img/iconMenuL.394f4492.jpg",
        badge: "https://app.okwhats.com.br/img/iconMenuL.394f4492.jpg",
        image:"https://app.okwhats.com.br/img/iconMenuL.394f4492.jpg",
        options: {
          body: body
        },
        vibrate: [200, 100, 200],
        events: {
            onerror: function () {
                console.log('Custom error event was called');
            },
            onclick: function () {
                console.log('Custom click event was called');
            },
            onclose: function () {
                console.log('Custom close event was called');
            },
            onshow: function () {
                console.log('Custom show event was called');
            }
        }
    }
    notification.show(dados_notification.title, dados_notification.options, dados_notification.events)
   
}

export default Notificantion