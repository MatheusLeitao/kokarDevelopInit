# Kokar Development Init

Kit para que inicialização de um novo projeto seja facilitada dentro da empresa. Fora definido no dia 09/08/2021, todos os projetos, **se possível**, tenham um ambiente para testes antes da homologação.

## Detalhes
<details>
 <summary>Definições</summary>

## Implantação de Ci/Cd
Serão implementados os métodos de Ci/Cd [(Continuous integration/Continuous Delivery) ](https://stackoverflow.com/a/28628086/11521405) e, como não temos uma complexidade nos serviços, nossa [Pipeline](https://en.wikipedia.org/wiki/Pipeline_(software)) será customizada para nossos serviços. Nosso pipeline será subdivido em quatro principais partes, sendo:

> * Code
> * Build Development
> * Test Development
> * Produção

### [IMAGEM DO STIGMA PIPELINE AQUI]

## Pipeline

Como dito, a pipeline sera constituída por quatro principais fases, code, build dev, test dev e produção.

### Code ou coding
É o momento em que mantemos toda a execução do **job**\*¹ na máquina, codamos, testamos o código (localmente), commitamos localmente, damos um merge na **branch development local**\*² (nota-se o branch *development* local, endereçaremos mais tarde.).

*1 e *2: Voltaremos a falar mais abaixo.

### Build Development
Este é o processo onde acontecerá toda a automação para deixar o código disponível para testes sem que haja quaisquer necessidades de interferência por parte do desenvolvedor, a ideia é que, uma vez que configurado, não haja necessidade de /trabalho para que façamos os testes do projeto a qual está sendo executado no momento.

**Todo este processo de automação (da *build develop*) acontecerá por [webhooks](#webhook)**

### Test Development
Nesta unidade, que antecede a homologação para a produção, é reservada **APENAS** para testes das changes que foram feitas. O servidor que for levantado para servir como servidor de testes, **NÃO PODE SER USADO COMO SERVIDOR LABORATORIAL**, servirá como um espelho do servidor de produção para imitar o ambiente mais similar o possível, deve ser um sistema mais hermético o possível.

Caso haja algum problema/bug nessa unidade, a change deverá voltar para o início do pipe.

### Produção
Nome autoexplicativo, a ponta do pipe, é a parte que é consumida pelos "consumidores" (clientes, aplicações, etc...), a pipeline deve ser usada de forma que, as changes que chegam aqui **NÃO PODEM CONTER BUGS**, caso contenha, não pode ser retornado ao início do pipe, apenas por intermédio de [hotfix](#git-flow). Assim como na segunda [fase](#aplicação), todo o processo de entrega é automatizado, porém, diferentemente da segunda fase, não é utilizado webhook e sim a ferramenta do [GitActions](#gitactions).

![Pipeline](https://github.com/MatheusLeitao/kokarDevelopInit/blob/master/pipeline.jpeg?raw=true)

</details>

<br/>
<br/>
<br/>

# Aplicação
Explanatório de como funciona a desta aplicação. Para que possamos entender de forma intuitiva, separaremos os processos do [*pipeline*](#pipeline) por **fases**.

Lembrando, cada processo é uma fase, sendo assim, [code](#code-ou-coding) é a primeira fase, [build dev](#build-development) a segunda fase e assim sucessivamente.

Na segunda fase, [build dev](#build-development), trabalharemos com o Git Webhook para que, assim que feito um commit na *branch de development*, seja feito o build automático no servidor de development levantado para o projeto.

***Ps: Estaremos trabalhando com webhook, pois, no dia de hoje, o GitActions não atende a separação de job por branch.***

## Webhook
Ao realizarmos um push ou merge para a branch development, o GitHub dispara um webhook que é interceptado pelo servidor, assim, é executado o script em shell que fara todas as rotínas necessárias para que o código rode.
<br>
<br>
**Diagrama de sequencia:**<br/>
![Diagrama de sequencia](https://github.com/MatheusLeitao/kokarDevelopInit/blob/master/sequence_diagram.jpeg?raw=true)
##### *(Imagens necessitam atualizações.)*


## GitActions
O [Git Actions](https://docs.github.com/en/actions/quickstart) é uma ferramenta disponibilizada pelo github de [CD](https://continuousdelivery.com/), como o todo já é automatizado por si só, não há necessidade de um terceiro para a aplicação funcionar, apenas que tenha um "listener" [(runners)](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners) no servidor para poder realizar os comandos.
<br>
<br>
**Diagrama de sequencia:**<br/>
![Diagrama de sequencia](https://github.com/MatheusLeitao/kokarDevelopInit/blob/master/sequence_diagram_actions.jpeg?raw=true)
##### *(Imagens necessitam atualizações.)*
<br>

#### Explanação
Não fora possível botar ambos as branchs para funcionar com o GitHubActions, pois, não tem como priorizar os [runners](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners) de acordo com a branch. Segundo a [documentação](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners#communication-between-self-hosted-runners-and-github), ao executar um [job](https://docs.github.com/en/actions/learn-github-actions/introduction-to-github-actions#the-components-of-github-actions), a queue seleciona o primeiro runner conectado, não há formas de priorizar.

# Dicionário

## Git Flow

Antes de adentrarmos mais a fundo do que será tratado em nosso git flow (quando digo nosso, digo pelo motivo de adaptarmos o ['git flow workflow'](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) à realidade da empresa.), devemos ter em mente alguns conceitos:

>[bugfix]: São bugs que podem ser encontrados pela unidade de teste ao decorrer do desenvolvimento que não precisam ser lançado de imediato, pois, não alteram o funcionamento da aplicação em produção.

>[hotfix]: São bugs encontrados por usuários e, impactam diretamente o uso da aplicação, portanto, deve ter a mais extrema urgência para consertar.

>[feature]: São novas funcionalidades que serão adicionadas ao sistema. (Na kokar devemos separar projeto de feature, as features são melhorias do sistema ou, apêndices de um sistema já em produção. Ex: A alexa voice command já está em uso, uma feature seria separar o comando do ar-condicionado para ir direto para o ar.)

>[fix]: Esta é a tag que mais usaremos em nossos projetos, está relacionado diretamente com as pequenas mudanças que se faz em um código, **dentro de uma feature** que está em desenvolvimento ou já fora lançada, como uma mudança da cor do botão, layouts, adições ou remoções de inputs, etc...

As tags do git flow **DEVEM** ser adicionadas no início de todas as branchs para os projetos. <br>
Exs:

* Será adicionado uma melhoria no app, uma função de adicionar conexão via bluetooth:
  * feature/bluetooth
* Adicionar dois botões diferentes para conectar o bluetooth
  * fix/bluetooth-botao
* Nos testes, foi verificado que primeiro botão ta demorando muito para abrir um modal
  * bugfix/bluetooth-botao
* Um cliente avisou que o botão de conectar o bluetooth não está funcionando.
  * hotfix/bluetooth-botão **(Este é urgente, deve ser corrigido e lançado à master.)**



### kokar flow

Para o flow que está definido agora, ao criar um projeto, **deve-se** separar a master/main da develop para que seja possível a separação e criação de ambientes de desenvolvimento. Portanto, o fluxo deve ser mais ou menos assim.

#### No git:
> Branches:
> * ┌   Master **(Bloqueada[*¹](#1-o-ideal-é-que-a-master-seja-bloqueada-para-que-apenas-quando-dois-revisem-o-pull-request-seja-homologado-ao-servidor-de-produção-assim-evitando-que-pequenos-erros-passem-desapercebido))**
> * ├    Develop (Reservada para uso laboratorial[*²](#2-servidor-laboratorial-para-uso-de-testes-onde-pode-ser-facilmente-formatado-e-descartado-onde-há-testes-de-novos-softwares-ou-instalações-de-dependencias-que-podem-alterar-o-funcionamento-do-sistema))
> * └    feature/@feature-name
>   * ├ fix/@feature-name
>   * └ bugfix/@feature-name

> hotfix/@feature-name - feature-name a qual o problema reside.

#### **Nota-se que, em teu repositório **DEVEM** ter ao menos essa estrutura:**

> * Master/Main
> * Develop

Consequentemente, quando um projeto conter uma feature **DEVE** por obrigação subir ao menos a branch da feature para o repositório remoto, no caso o GitHub, para que outras pessoas tenham ciência do trabalho, contudo, assim que a feature for finalizada, a branch remota **pode ser removida.**. **Importante, esta branch `deve ser derivada da master`, a branch mais "zerada" e que está em uso no momento.**
<br>
<br>
Referente as tags, fix e bugfix, podem ser mantidas em repositórios locais e adicionadas à branch develop. Agora, tratando-se da hotfix, ela pode ser retirada diretamente da master, porém, o ideal é que retire ela da branch feature/@feature-name e refaça todos os caminhos até homologar em produção.

**Para os flows, serão organizados desta forma:**<br>

* Push local feature/* para a remote feature/* que você **DEVE** ter criado assim que teve a feature.
  * merge local feature/* com local develop para que a dev contenha todas as features do seu projeto.
    * push do local develop para remote develop para que seja buildado no servidor de development e esteja pronto para o uso.
    * Teste no servidor de development para que seja aprovado a homologação ou reprovado.
      * Caso aprovado, será criado um [pull request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) e analisado para aprovação.
      * Caso reprovado, deverá voltar para o início da [pipeline](#pipeline).

Segue imagens para exemplificação.
![workflow](https://github.com/MatheusLeitao/kokarDevelopInit/blob/master/kokar_workflow.jpeg?raw=true)

<br>

##### *1: O ideal é que a master seja bloqueada para que, apenas quando dois revisem o pull request seja homologado ao servidor de produção, assim, evitando que pequenos erros passem desapercebido.
##### *2: servidor Laboratorial para uso de testes, onde pode ser facilmente formatado e descartado, onde há testes de novos softwares ou instalações de dependencias que podem alterar o funcionamento do sistema.

<br>


Imagens retiradas de:
[Figma](https://www.figma.com/file/3tmODjkqTgFP72x74sYuxf/Kokar-Pipeline?node-id=0%3A1)