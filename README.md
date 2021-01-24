## Desafio Backend - Delivery Much

Para excecutar o projeto, com docker e docker-compose instalados na sua maquina, basta digitar `docker-composer up` e aguardar os serviços serem inicializados.

Apos o ambiente tiver sido inicializado, é possível popular a tabela `products` entrando no serviço de backend atravéz de outro terminal com o comando `docker-compose exec backend sh` e rodando o script `npm run db:populate`

Para execução dos testes unitários utilize o script `test` do package.json (`npm test` ou `yarn test`)
