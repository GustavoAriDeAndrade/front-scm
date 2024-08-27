# utiliza o nginx
FROM nginx:stable
# copia o build para a pasta informada
COPY ./dist/ /var/www
# copia a config do nginx para a pasta informada
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# inicializa o nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]