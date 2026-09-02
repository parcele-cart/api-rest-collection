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

## Cobertura do contrato documentado

A collection cobre **16/16 endpoints documentados** em https://parcelecart.readme.io (38 requests, incluindo cenários de falha que validam as mensagens de erro):

- Autenticação: `POST /v1/auth/login`, `POST /v1/auth/refresh-token`
- Link de Pagamentos: `POST /v1/payment-link`, `GET /v1/payment-link/list`, `GET /v1/payment-link/:id`, `GET /v1/payment-link/receipt-pdf/:id`, `POST /v1/payment-link/cancel/:id`, `POST /v1/payment-link/add-payment-boleto-pix`
- Cobranças Avulsas: `POST /v1/payment/credit-card/pay`, `POST /v1/payment/pix-qrcode/generate`
- Simulador: `POST /v1/simulator/consult-payment-fees`
- Pedidos: `POST /v1/order`
- Vendas: `GET /v1/sale/list`, `GET /v1/sale/:id`
- Recebíveis: `GET /v1/receivable/date/:year/:month/:day`, `GET /v1/receivable/:year/:month`

> Rotas existentes na API mas **não documentadas** no readme.io (fora da cobertura): `/webhook/*` (7), `/api-log/*` (2), `/sale/export-xlsx`, `/receivable/export-xlsx`, `/v2/simulator/consult-payment-fees`, `/v1/payment/charge/document/:id`, `/v1/payment-link/expire-payment-links`.

## Validação de paridade (migração rest-api → saturno-api)

O diretório `parity/` roda a **mesma collection** contra o proxy atual (baseline) e contra a saturno-api migrada (candidate) e compara request a request: status code, cada assertion e o corpo normalizado (ignorando campos voláteis como tokens, URLs de arquivo e datas).

```bash
BASELINE_URL=https://api-sandbox.parcelecart.com.br \
CANDIDATE_URL=http://localhost:8080 \
CLIENT_ID=xxx CLIENT_SECRET=yyy \
./parity/run-parity.sh
```

O relatório aponta qualquer divergência nomeada por request. Saída `✅ PARIDADE TOTAL` é o gate para o cutover do Cloudflare.

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