# SublimeAtlas #

Version : 0.1 (Beta)

NodeAtlas Version minimale : 0.44

**For an international version of this README.md, [see below](#international-version).**



## Avant-propos ##

SublimeAtlas permet la construction de site ou maquette HTML par empilement de Composant (Component) avec [NodeAtlas](http://www.lesieur.name/nodeatlas/). Le site peut alors être construit par brique uniquement par modifications des fichiers de variations (`.json`) et le tout en temps réel (sans redémarrage).

1. On n'inclut plus de composant avec `include('name-of-component.htm')` mais on défini des zones d’atterrissage de composants avec `includeComponents('componentsPlaceholder')`.

2. Chaque zone d'atterissage permet d'injecter une liste de composant (et non juste un seul).

3. Chaque composant peut avoir son propre lot de variables spécifiques `specific`.

4. Les composants peuvent être inclus dans des composants qui peuvent être inclus dans des composants qui...

5. L'arborescence complète d'injection des composants est gérée en temps réel via les fichiers de variations.

6. Complètement compatible avec [EditAtlas](https://github.com/Haeresis/EditAtlas/) pour éditer à chaud l'arborescence des composants et modifier en temps réel la structure même d'une page web.

Vous pouvez télécharger ce repository en vu de le tester ou de l'intégrer à l'un de vos projets [NodeAtlas](http://www.lesieur.name/nodeatlas/) ou node.js.



## Comment ça marche ? ##

[NodeAtlas](http://www.lesieur.name/nodeatlas/) utilise un système d'inclusion permettant d'intégrer des fragments de HTML pour rendre vos constructions plus facilement maintenables.

Le problème est que la fonction `include` impose de poser en dur dans le code le chemin du fragment HTML utilisé :

```html
<%- include("name-of-component.htm") %>
```

Bien entendu, avec un peu d'astuce, il suffit de mettre ce chemin dans un fichier de variation pour rendre « dynamique » l'injection de composant :

```html
<%- include(specific.nameOfComponent) %>
```

On arrive rapidement à la conclusion qu'il serait agréable :
- de mieux ranger ses composants dans les fichiers de variations pour gérer une page.
- de pouvoir inclure plus d'un composant à l'endroit ou l'on à souhaiter en inclure un.
- de pouvoir gérer les variables de chaque composant dans son propre scope permettant d'inclure un composant plusieurs fois avec ses propres variations.

```html
<% for (var i = 0; i < specific.component['firstComponentsPlaceholder'].length; i++) { %>
	<%- include(specific.component['firstComponentsPlaceholder'][i].nameOfComponent.path, specific.component['firstComponentsPlaceholder'][i].nameOfComponent.variation) %>
<% } %>
```

On aimerait même pouvoir inclure des composants dans des composants et rendre ça compatible avec [EditAtlas](https://github.com/Haeresis/EditAtlas/) ! C'est ce que fait SublimeAtlas.


### Inclure des Composants dans un Template ###

Cela se réalise avec `includeComponents('componentsPlaceholder')`. Par exemple :

Avec le template `templates/home.htm` suivant :

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
    	<title><%- specific.titleOfPage %></title>
	</head>
	<body>
		<div class="layout">
			<h1><%- specific.titleOfPage %></h1>
			<header>
				<%- includeComponents('headerPlaceholder') %>
			</header>
			<%- includeComponents('mainPlaceholder') %>
			<footer>
				<%- includeComponents('footerPlaceholder') %>
			</footer>
		</div>		
	</body>
</html>
```

et le fichier de variation spécifique `variations/home.json` suivant :

```js
{
	"titleOfPage": "Titre de la Page",
    "components": {
        "headerPlaceholder": [{
            "path": "name-of-component.htm",
            "variation": {
                "title": "Title 1",
                "content": "Content 1"
            }       
        }, {
            "path": "name-of-component.htm",
            "variation": {
                "title": "Title 2",
                "content": "Content 2"
            }
        }],
        "mainPlaceholder": [{
            "path": "name-of-component.htm",
            "variation": {
                "title": "Title 3",
                "content": "Content 3"
            }
        }, {
            "path": "name-of-component.htm",
            "variation": {
                "title": "Title 4",
                "content": "Content 4"
            }
        }],
        "footerPlaceholder": [{
            "path": "name-of-component.htm",
            "variation": {
                "title": "Title 5",
                "content": "Content 5"
            }
        }, {
            "path": "name-of-component.htm",
            "variation": {
                "title": "Title 6",
                "content": "Content 6"
            }
        }]
    }
}
```

ainsi que le composant `components/name-of-component.htm` suivant :

```html
<section class="name-of-component.htm">
    <div class="ui">
        <h1><%- component.title %></h1>
        <%- component.content %>
    </div>
</section>
```

on peut générer une page. Notez que redéfinir la liste des composants dans les « placeholder » vous permet de modifier la disposition de la page finale. Comme les fichiers de variations sont relu à chaque affichage de page, le changement ne nécéssite aucun redémarrage.


### Inclusion depuis les variations communes ### 

Il est également possible de mettre les composants se retrouvant sur chaque page dans le fichier de variation commune `variations/common.js`. 

Il suffit de placer en second paramètre le mot clé `common` : `includeComponents('componentsPlaceholder', 'common')`. Par exemple :

avec le template `templates/home.htm` suivant :

```html
<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="UTF-8">
        <title><%- specific.titleOfPage %></title>
    </head>
    <body>
        <div class="layout">
            <h1><%- specific.titleOfPage %></h1>
            <header>
                <%- includeComponents('headerPlaceholder', 'common') %>
            </header>
            <%- includeComponents('mainPlaceholder') %>
            <footer>
                <%- includeComponents('footerPlaceholder', 'common') %>
            </footer>
        </div>      
    </body>
</html>
```

et le fichier de variation spécifique `variations/home.json` suivant :

```js
{
    "titleOfPage": "Titre de la Page",
    "components": {
        "mainPlaceholder": [{
            "path": "name-of-component.htm",
            "variation": {
                "title": "Title 3",
                "content": "Content 3"
            }
        }, {
            "path": "name-of-component.htm",
            "variation": {
                "title": "Title 4",
                "content": "Content 4"
            }
        }]
    }
}
```

et le fichier de variation commune `variations/common.json` suivant :

```js
{
    "titleOfPage": "Titre de la Page",
    "components": {
        "headerPlaceholder": [{
            "path": "name-of-component.htm",
            "variation": {
                "mainTag": "div",
                "title": "Title 1",
                "content": "Content 1"
            }
        }, {
            "path": "name-of-component.htm",
            "variation": {
                "mainTag": "div",
                "title": "Title 2",
                "content": "Content 2"
            }
        }],
        "footerPlaceholder": [{
            "path": "name-of-component.htm",
            "variation": {
                "mainTag": "div",
                "title": "Title 5",
                "content": "Content 5"
            }
        }, {
            "path": "name-of-component.htm",
            "variation": {
                "mainTag": "div",
                "title": "Title 6",
                "content": "Content 6"
            }
        }]
    }
}
```

ainsi que le composant `components/name-of-component.htm` suivant :

```html
<section$ class="name-of-component.htm">
    <div class="ui">
        <h1$><%- component.title %></h1$>
        <%- component.content %>
    </div>
</section$>
```

on peut générer une page. Voyons l'utilité de `$` et de `mainTag` ci-après.


### Modification de Header contextuel ###

Il serait intéressant de pouvoir transformer les `<section>` dans vos composants par une autre balise HTML5 ou même une simple `<div>` au besoin car cela dépend de où vous déciderez de déposer le composant.

Dans notre cas, il serait interessant d'avoir une simple `<div>` pour les composants injectés dans la partie `<header>` ou dans la partie `<footer>`.

Le problème c'est qu'en faisant ça, vous aurez dans le `<header>` le `<h1>` principal mais également le `<h1>` du composant qui ne serait plus isolé dans une `<section>` devenue une `<div>`. Et bien SublimeAtlas peut gérer simplement tout cela !

Vous aurez remarqué que le composant `components/name-of-component.htm` possède des `$` sur les balises `<section>` et sur la balise `<h1>`. Et qu'il y a une variable `mainTag` pour chaque composant du fichier `variations/common.json`.

Ces `$` sont retirés lors de la génération HTML finale s'il n'existe pas de `mainTag` en variation pour le composant. Cependant en fonction du `mainTag` utilisé, plusieurs transformations seront opérées.

En voici les cas :

- S'il existe des balises `<nav$>...</nav$>`, `<aside$>...</aside$>`, `<section$>...</section$>`, `<article$>...</article$>` ou `<div$>...</div$>` elles seront remplacées par le tag spécifié dans le `mainTag`. 
   *Par exemple dans notre composant : `<section$>...</section$>` deviendra `<div>...</div>` car `mainTag` vaut `div`.*
   
- Si mainTag est égale à : `div`, `header` ou `footer`, alors toutes les balises `<header$>...<header$>`, `<footer$>...</footer$>`, `<h1$>...</h1$>`, `<h2$>...</h2$>`, `<h3$>...</h3$>`, `<h4$>...</h4$>`, `<h5$>...</h5$>` ou `<h6$>...</h6$>` deviendront respectivement des balises : `<div class="header-like" $>...<div>`, `<div class="footer-like" $>...</div>`, `<div class="h1-like">...</div>`, `<div class="h2-like">...</div>`, `<div class="h3-like">...</div>`, `<div class="h4-like">...</div>`, `<div class="h5-like">...</div>` ou `<div class="h6-like">...</div>`.


### Inclure des Composants dans un Composant ###

Il est possible d'inclure en cascade des composants dans des composants de manière à pouvoir réaliser n'importe quelle page avec une cascade de n'importe quelles composants ou liste de composants. Il suffit en plus de passer la variable `component` : `<%- includeComponents('componentsPlaceholder', component) %>`. 

*Note : il est toujours possible dans un composant d'injecter un composant depuis la racine des variations `specific` ou `common` avec `<%- includeComponents('componentsPlaceholder') %>` ou `<%- includeComponents('componentsPlaceholder', 'common') %>`.*

Par exemple : 

avec le template `templates/home.htm` suivant :

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title><%- specific.titleOfPage %></title>
    </head>
    <body>
        <div class="layout">
            <h1><%- specific.titleOfPage %></h1>
            <%- includeComponents('root') %>
        </div>      
    </body>
</html>
```

et le fichier de variation spécifique `variations/home.json` suivant :

```js
{
    "titleOfPage": "Titre de la Page",
    "components": {
        "root": [{
            "path": "name-of-component.htm",
            "variation": {
                "mainTag": "header",
                "title": "Title Header",
                "content": "Content Header",
                "components": {
                    "item1": [{
                        "path": "name-of-component.htm",
                        "variation": { 
                            "mainTag": "nav"
                            "content": "Content Main Nav"
                        }
                    }]
                }
            }
        }, {
            "path": "name-of-component.htm",
            "variation": {
                "mainTag": "article",
                "title": "Title Content",
                "content": "Content Content",
                "components": {
                    "item1": [{
                        "path": "name-of-component.htm",
                        "variation": { 
                            "mainTag": "aside"
                            "title": "Title Ads 1"
                        }
                    }],
                    "item2": [{
                        "path": "name-of-component.htm",
                        "variation": { 
                            "mainTag": "div"
                            "content": "Main Content"
                        }
                    }],
                    "item3": [{
                        "path": "name-of-component.htm",
                        "variation": { 
                            "mainTag": "aside"
                            "title": "Title Ads 2"
                        }
                    }]
                }
            }
        }, {
            "path": "name-of-component.htm",
            "variation": {
                "mainTag": "aside",
                "title": "Title Aside",
                "content": "Content Aside"
            }
        }, {
            "path": "name-of-component.htm",
            "variation": {
                "mainTag": "footer",
                "title": "Title Footer",
                "content": "Content Footer",
                "components": {
                    "item1": [{
                        "path": "name-of-component.htm",
                        "variation": { 
                            "mainTag": "nav"
                            "content": "Content Second Nav"
                        }
                    }]
                }
            }
        }]
    }
}
```

ainsi que le composant `components/name-of-component.htm` suivant :

```html
<section$ class="name-of-component.htm">
  	<div class="ui">
	  	<h1$><%- component.title %></h1$>
	  	<%- component.content %>
		<ul>
			<% if (component && component.components && component.components['item1']) { %>
			<li>
				<div class="component-example--item">
					<%- includeComponents('item1', component) %>
				</div>
			</li>
			<% } %>
			<% if (component && component.components && component.components['item2']) { %>
			<li>
				<div class="component-example--item">
					<%- includeComponents('item2', component) %>
				</div>
			</li>
			<% } %>
			<% if (component && component.components && component.components['item3']) { %>
			<li>
				<div class="component-example--item">
					<%- includeComponents('item3', component) %>
				</div>
			</li>
			<% } %>
		</ul>
	</div>
</section$>
```

Nous pouvons générer la page que nous souhaitons, avec les conténeurs souhaités et une sémantique HTML5 aux petits oignons.

#### Boucle de composant ####

Le composant `components/name-of-component.htm` de notre exemple précédent aurait tout aussi bien pu être créer à l'aide d'une boucle pour gérer autant d'éléments que voulu comme suit :

```html
<section$ class="name-of-component.htm">
    <div class="ui">
        <h1$><%- component.title %></h1$>
        <%- component.content %>
        <% if (component && component.components) { %>
        <ul>
        <% for (var placeholder in component.components) { %>
            <% if (component.components.hasOwnProperty(placeholder)) { %>
            <li>
                <div class="component-example--item">
                    <%- includeComponents(placeholder, component, path) %>
                </div>
            </li>
            <% } %>
        <% } %>
        </ul>
        <% } %>
    </div>
</section$>
```



### Intégrer SublimeAtlas à votre site NodeAtlas ###

Malgré le nombre de fichier dans cet exemple, le coeur même utile de SublimeAtlas pour vos propres sites node.js avec NodeAtlas se résume à un fichier et un appel.

#### Inclusion côté server ####

Il va falloir faire appel à une fonction provenant du fichier `components/controllers/sublime-atlas.js` dans votre controlleur commun pour permettre au moteur de template de reconnaître `includeComponents` comme dans cet exemple dans `controllers/common.js` :

```js
(function (publics) {
    "use strict";

    publics.changeVariation = function (params, mainCallback) {
        var variation = params.variation,
            NA = params.NA;
        
        variation = require('../components/controllers/sublime-atlas').includeComponents(variation, NA);

        mainCallback(variation);
    };

}(website));
```

Vous pouvez changer `mainTag` par une autre propriété la changeant lors de l'appel de la fonction et également mettre l'intégralité de vos composants ailleurs que dans `components`. Essayons par exemple `tag` et `placeholders` :

```js
variation = require('../components/controllers/sublime-atlas').includeComponents(variation, NA, "placeholders", "tag");
```


### Utilisation avec EditAtlas ###

Grâce à l'objet `path` en complément de l'objet `component` accessible depuis chaque composant, vous pouvez savoir dans quelle lot de variations de composants les variables courantes sont. Cela vous permet de les retrouver dans vos fichiers `common` ou `specific` par leur chemin absolue ce qui va être parfait pour utiliser [EditAtlas](https://github.com/Haeresis/EditAtlas/).

Il suffit de passer `path` comme c'est le cas de `component` lors de l'inclusion de composant dans des composants : `<%- includeComponents('componentsPlaceholder', component, path) %>` (depuis un template, il n'y a rien à changer).

Vous trouverez des exemples d'utilisation sur le [repository de EditAtlas](https://github.com/Haeresis/EditAtlas/).





## Lancer ce repository en local ##

Pour faire tourner le site en local, il vous faudra installer [NodeAtlas](http://www.lesieur.name/node-atlas/) sur votre poste de développement.

Déplacez vous ensuite dans le dossier :


```
\> cd </path/to/blog>
```

et utilisez la commande :

```
\> node </path/to/>node-atlas/node-atlas.js --browse
```

ou lancez `server.na` en double cliquant dessus :
- en expliquant à votre OS que les fichiers `.na` sont lancé par défaut par `node`,
- en ayant installé `node-atlas` via `npm install -g node-atlas`
- en étant sur que votre variable d'environnement `NODE_PATH` pointe bien sur le dossier des `node_modules` globaux.

Le site sera accessible ici :

- *http://localhost:7777/*

-----


## International Version ##

### Overview ###

Work in progress for this documentation.