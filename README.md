docker-compose up rabbitmq stock-service
docker-compose up backend adminer

Apos o ambiente tiver sido inicializado, é possível popular a tabela `products` entrando no serviço de backend com o comando `docker-compose exec backend sh` e rodando o script com `npm run db:populate`
