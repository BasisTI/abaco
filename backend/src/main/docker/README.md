# Ábaco via Docker

## Editar o arquivo docker-compose.yml

Variáveis a considerar:

- `services.abaco-ui.ports` - Editar caso seja necessário externalizar ou não uma porta específica. Precisa apontar para a porta 80 internamente.
- `services.abaco.environment.SPRING_DATASOURCE_xxxx` - Editar caso os dados de acesso a banco sejam diferentes do padrão. Devem ficar iguais aos dados em `pgsql-abaco.environment`.
- `services.abaco.environment.SPRING_MAIL_xxxx` - Editar com dados do próprio servidor de e-mail (SMTP).
- `services.pgsql-abaco.environment.xxxx` - Dados do banco a ser criado. Serão persistidos em volume na inicialização.
- `volumes` - Persistência dos arquivos no ambiente. Devem ser editados de acordo com o ambiente em que vão executar, na seção inicial do docker-compose e nas referências do `pgsql-abaco` e `es-abaco`.

## Subir o docker-compose

Executar o comando `docker-compose up -d`