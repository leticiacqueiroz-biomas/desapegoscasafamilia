# Como ligar os formulários (passo a passo)

## O fluxo da vendedora (rede por convite)

> No começo, vender é **só por convite**. Não há botão público "Quero vender" — a vendedora convidada recebe o link `cadastrar-vendedor.html` de você ou de outra vendedora da rede.

1. **Cadastro da vendedora** (`cadastrar-vendedor.html`) — ela envia os dados pessoais (incluindo **quem a convidou**) e aguarda.
2. **Você aprova** na planilha de Vendedoras (muda Aprovada para TRUE).
3. Você manda para ela, no WhatsApp, o link de **cadastro de itens** já com o nome dela:
   `www.desapegadas.com/cadastrar-itens.html?v=Maria&z=5573999998888`
4. Ela cadastra **1 ou vários itens de uma vez** (`cadastrar-itens.html`).
5. Você aprova os itens na planilha de Cadastro, e eles entram na loja.

> Obs: criei uma planilha nova **"desapegadas — Vendedoras (rede por convite)"** com a coluna "Quem te convidou". A planilha antiga "Vendedores" ficou sem uso — pode apagar.

## Os arquivos

- `cadastrar-vendedor.html` — cadastro do vendedor (dados pessoais)
- `cadastrar-itens.html` — cadastro de itens (vários de uma vez, com fotos)
- `avaliar.html` — avaliação do vendedor (estrelas)
- `AppsScript-desapegadas.gs` — o "motor" que recebe os envios
- 3 planilhas no seu Drive: **Vendedores**, **Cadastro de Itens** e **Avaliações**

---

## Passo 1 — Criar o "motor" (Apps Script)

1. Acesse **script.google.com** → **Novo projeto**.
2. Apague o exemplo, abra o `AppsScript-desapegadas.gs` e **cole todo o conteúdo** dele.
3. Salve (disquete). Nome do projeto: *desapegadas*.

> Os IDs das 3 planilhas já estão dentro do script — não precisa mexer.

## Passo 2 — Publicar como aplicativo da web

1. **Implantar → Nova implantação**.
2. Tipo: **App da Web** (engrenagem → App da Web).
3. **Executar como:** Eu · **Quem pode acessar:** **Qualquer pessoa**.
4. **Implantar** → autorize (na tela "O Google não verificou este app" → **Avançado → Acessar (não seguro)**; é seu app). Permita Drive e Planilhas.
5. **Copie a URL do app da web** (`https://script.google.com/macros/s/AKfy.../exec`).

## Passo 3 — Colar a URL nos 3 formulários

Em `cadastrar-vendedor.html`, `cadastrar-itens.html` **e** `avaliar.html`, troque:

```
const ENDPOINT = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";
```

pela sua URL.

## Passo 4 — Subir no site (GitHub)

Suba os 3 formulários + o `index.html` (que já tem o botão "+ Quero vender").

## Passo 5 — Testar

1. `cadastrar-vendedor.html` → cadastre um vendedor de teste → confira a planilha **Vendedores**.
2. `cadastrar-itens.html?v=Teste&z=5573999998888` → cadastre 2 itens com foto → confira a planilha **Cadastro de Itens** (uma linha por item) e as fotos na pasta **"desapegadas - fotos dos anuncios"** do Drive.
3. `avaliar.html?v=Leticia` → dê uma nota → confira a planilha **Avaliações**.

---

## Sua rotina

- **Vendedor novo:** chega na planilha Vendedores (Aprovado=FALSE). Você aprova e manda o link de itens.
- **Itens novos:** chegam na planilha Cadastro (FALSE). Você aprova o que entra na loja.
- **Avaliações:** chegam (FALSE). Você dá o ok.

## Aviso em 1 clique (grátis)

Para avisar a vendedora aprovada sem digitar nada, use uma fórmula na planilha **Vendedoras**. Ela cria um botão **"📲 Avisar"** que abre o WhatsApp com a mensagem pronta (já com o link de cadastro de itens dela).

1. Na planilha Vendedoras, clique na célula **H1** e escreva o título: `Avisar`.
2. Clique na célula **H2** e cole esta fórmula:

```
=SE(G2=VERDADEIRO; HIPERLINK("https://wa.me/"&C2&"?text="&CODIFICARURL("Oi "&B2&"! Seu cadastro de vendedora no desapegadas foi aprovado 💚 Agora é só cadastrar seus itens aqui: https://www.desapegadas.com/cadastrar-itens.html?v="&B2&"&z="&C2&" — pode adicionar quantos quiser de uma vez!"); "📲 Avisar "&B2); "")
```

3. Clique na célula H2, copie (Ctrl/Cmd+C) e cole nas linhas de baixo (H3, H4...) — ou arraste a alça do canto para baixo. Assim cada nova vendedora ganha o botão.
4. **Como usar:** quando você marcar a coluna **Aprovada** (G) como verdadeiro, o link "📲 Avisar Maria" aparece na coluna H. Clique nele → o WhatsApp abre com a mensagem pronta → você envia. Pronto.

> Se a sua planilha estiver em inglês, troque os nomes das funções: `SE`→`IF`, `HIPERLINK`→`HYPERLINK`, `CODIFICARURL`→`ENCODEURL`, `VERDADEIRO`→`TRUE`.

Custo: **zero**. Você só dá 1 clique para avisar — sem API paga, sem número dedicado.

## Próximo passo (faço eu)

Fazer o site **ler as planilhas sozinho** (itens aprovados na loja + média de estrelas). Publique cada planilha como CSV (**Arquivo → Compartilhar → Publicar na web → CSV**) e me mande os links. A partir daí, sua rotina vira só **aprovar**. 💚
