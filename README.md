# Kokar Development Init!

Kit para que inicialização de um novo projeto seja facilitada dentro da empresa. Fora definido no dia 09/08/2021, todos os projetos, **se possível**, tenham um ambiente para testes antes da homologação.

## Detalhes
<!-- <details> -->
 <summary>Definições</summary>

## Implantação de Ci/Cd
Serão implementados os métodos de Ci/Cd [(Continuous integration/Continuous Delivery) ](https://stackoverflow.com/a/28628086/11521405) e, como não temos uma complexidade nos serviços, nossa [Pipeline](https://en.wikipedia.org/wiki/Pipeline_(software)) será customizada para nossos serviços. Nosso pipeline será subdivido em quatro principais partes, sendo:

> * Code
> * Build Development
> * Test Development
> * Produção

### [IMAGEM DO STIGMA PIPELINE AQUI]

## Pipeline

Como dito, a pipeline sera constituida por quatro principais fases, code, build dev, test dev e produção.

### Code ou coding
É o momento em que mantemos toda a execução do **job**\*¹ na máquina, codamos, testamos o código (localmente), commitamos localmente, damos um merge na **branch development local**\*² (nota-se o branch *development* local, endereçaremos mais tarde.).

*1 e *2: Voltaremos a falar mais abaixo.

### Build Development
Este é o processo onde acontecerá toda a automação para deixar o código disponível para testes sem que haja quaisquer necessidades de interferência por parte do desenvolvedor, a ideia é que, uma vez que configurado, não haja necessidade de /trabalho para que façamos os testes do projeto a qual está sendo executado no momento.

**Todo este processo de automação (da *build develop*) acontecerá por [webhooks](#webhook)**

### Test Development
Nesta unidade, que antecede a homologação para a produção, é reservada **APENAS** para testes das changes que foram feitas. O servidor que for levantado para servir como servidor de testes, **NÃO PODE SER USADO COMO SERVIDOR LABORATORIAL**, servirá como um espelho do servidor de produção para imitar o ambiente mais similar o possível, deve ser um sistema mais hermético o possível.

Caso haja algum problema/bug nessa unidade, a change deverá voltar para o inicio do pipe.

### Produção
Nome autoexplicativo, a ponta do pipe, é a parte que é consumida pelos "consumidores" (clientes, aplicações e etc...), a pipeline deve ser usada de forma que, as changes que chegam aqui **NÃO PODEM CONTER BUGS**, caso contenha, não pode ser retornado ao início do pipe, apenas por intermédio de [hotfix](#git-flow). Assim como na segunda [fase](#aplicação), todo o processo de entrega é automatizado, porém, diferentemte da segunda fase, não é utilizado webhook e sim a ferramenta do [GitActions](#gitactions).

![Pipeline](https://github.com/MatheusLeitao/kokarDevelopInit/blob/master/pipeline.jpeg?raw=true)

</details>

<br/>
<br/>
<br/>

# Aplicação
Explanatório de como funciona a desta aplicação. Para que possamos entender de forma intuitiva, separaremos os processos do [*pipeline*](#pipeline) por **fases**.

Lembrando, cada processo é uma fase, sendo assim, [code](#code-ou-coding) é a primeira fase, [build dev](#build-development) a segunda fase e assim sucessivamente.

Na segunda fase, [build dev](#build-development), trabalharemos com o Git Webhook para que, assim que feito um commit na *branch de development*, seja feito o build automático no servidor de development levantado para o projeto.

***Ps: Estaremos trabalhando com webhook pois, no dia de hoje, o GitActions não atende a separação de job por branch.***

## Webhook
Ao realizarmos um push ou merge para a a branch development, o GitHub dispara um webhook que é interceptado para o serivdor, assim, é executado o script em shell que fara todas as rotínas necessárias para que o código rode.
<br>
<br>
**Diagrama de sequencia:**<br/>
![Diagrama de sequencia](https://github.com/MatheusLeitao/kokarDevelopInit/blob/master/sequence_diagram.jpeg?raw=true)
##### *(Imagens necessitam atualizações.)*


## GitActions
O [Git Actions](https://docs.github.com/en/actions/quickstart) é uma ferramenta disponibilizada pelo github de [CD](https://continuousdelivery.com/), como o todo já é automatizado por sí só, não há necessidade de um terceiro para a aplicação funcionar, apenas que tenha um "listener" [(runners)](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners) no servidor para poder realizar os comandos.
<br>
<br>
**Diagrama de sequencia:**<br/>
![Diagrama de sequencia](https://github.com/MatheusLeitao/kokarDevelopInit/blob/master/sequence_diagram_actions.jpeg?raw=true)
##### *(Imagens necessitam atualizações.)*



# Dicionário

### Git Flow
```
[bugfix]: São bugs que podem ser encontratos pela unidade de teste ao decorrer do desenvolvimento que não precisam ser lançado de imediato pois não alteram o funcionamento da aplicação em produção.

[hotfix]: São bugs encontrados por usuários e, impactam diretamente o uso da aplicação, portanto, deve ter a mais extrema urgência para consertar.

[feature]: São novas funcionalidades que serão adiconada ao sistema. (Na kokar devemos separar projeto de feature, as features são melhorias do sistema ou, apêndices de um sistema já em produção. Ex: A alexa voice command já está em uso, uma feature seria separar o comando do ar-condicionado para ir direto para o ar.)
```

Imagens retiradas de:
[Figma](https://www.figma.com/file/3tmODjkqTgFP72x74sYuxf/Kokar-Pipeline?node-id=0%3A1)

