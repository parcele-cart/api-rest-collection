# Testes da API Rest com Newman

Este repositório contém uma aplicação que utiliza Newman para executar testes na sua API Rest.

## Instalação

Certifique-se de ter o Node.js instalado. Em seguida, instale o Newman globalmente via npm (Node Package Manager):

```bash
npm install -g newman@6
```

Depois de clonar este repositório, instale as dependências:

```bash
npm install
```

## Configuração

Este projeto utiliza variáveis de ambiente para o ambiente sandbox. Certifique-se de configurar corretamente os arquivos de ambiente.

- `sandbox.postman_environment.json`

Deve-se informar o `CLIENT_ID` e `CLIENT SECRET`.

## Executando os Testes

Você pode executar os testes para um ambiente específico utilizando os seguintes comandos no terminal:

### Testes no ambiente sandbox:

```bash
npm run postman:sandbox
```
## Contribuição

Sinta-se à vontade para contribuir com melhorias, correções ou novos recursos. Basta seguir estes passos:

1. Fork do repositório
2. Crie uma branch com a sua feature (`git checkout -b feature/MinhaFeature`)
3. Faça commit das mudanças (`git commit -am 'Adicionando nova feature'`)
4. Faça push para a branch (`git push origin feature/MinhaFeature`)
5. Crie um novo Pull Request

## Suporte

Se encontrar algum problema ou tiver dúvidas, por favor, abra uma [issue](link para as issues do repositório) aqui no repositório.

---

Adapte este README.md conforme necessário para refletir informações específicas sobre sua aplicação, como detalhes adicionais sobre os testes, informações de contato ou quaisquer outros detalhes relevantes para os usuários do seu projeto.