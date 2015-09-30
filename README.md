# ComponentAtlas #

Version : 0.3 (Beta)

NodeAtlas Version minimale : 1.0

**For an international version of this README.md, [see below](#international-version).**



## Avant-propos ##

ComponentAtlas permet la construction de site ou maquette HTML par empilement de Composant (Component) avec [NodeAtlas](http://www.lesieur.name/nodeatlas/). Le site peut alors être construit par brique uniquement par modifications des fichiers de variations (`.json`) et le tout en temps réel (sans redémarrage).

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

On aimerait même pouvoir inclure des composants dans des composants et rendre ça compatible avec [EditAtlas](https://github.com/Haeresis/EditAtlas/) ! C'est ce que fait ComponentAtlas.


### Inclure des Composants dans un Template ###

Cela se réalise avec `includeComponents('componentsPlaceholder')`. Par exemple :

Avec le template `templates/home.htm` suivant :

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
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
	"titleOfPage": "Title of the Page",
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
<section class="name-of-component">
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
    <meta charset="utf-8">
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
    "titleOfPage": "Title of the Page",
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
    "titleOfPage": "Title of the Page",
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
<section$ class="name-of-component">
    <div class="ui">
        <h1$><%- component.title %></h1$>
        <%- component.content %>
    </div>
</section$>
```

on peut générer une page. Voyons l'utilité de `$` et de `mainTag` ci-après.


### Modification de Headers contextuel ###

Il serait intéressant de pouvoir transformer les `<section>` dans vos composants par une autre balise HTML5 ou même une simple `<div>` au besoin car cela dépend de où vous déciderez de déposer le composant.

Dans notre cas, il serait interessant d'avoir une simple `<div>` pour les composants injectés dans la partie `<header>` ou dans la partie `<footer>`.

Le problème c'est qu'en faisant ça, vous aurez dans le `<header>` le `<h1>` principal mais également le `<h1>` du composant qui ne serait plus isolé dans une `<section>` devenue une `<div>`. Et bien ComponentAtlas peut gérer simplement tout cela !

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
        <meta charset="utf-8">
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
    "titleOfPage": "Title of the Page",
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
<section$ class="name-of-component">
  	<div class="ui">
	  	<h1$><%- component.title %></h1$>
	  	<%- component.content %>
		<ul>
			<% if (component && component.components && component.components['item1']) { %>
			<li>
				<div class="name-of-component--item">
					<%- includeComponents('item1', component) %>
				</div>
			</li>
			<% } %>
			<% if (component && component.components && component.components['item2']) { %>
			<li>
				<div class="name-of-component--item">
					<%- includeComponents('item2', component) %>
				</div>
			</li>
			<% } %>
			<% if (component && component.components && component.components['item3']) { %>
			<li>
				<div class="name-of-component--item">
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
<section$ class="name-of-component">
    <div class="ui">
        <h1$><%- component.title %></h1$>
        <%- component.content %>
        <% if (component && component.components) { %>
        <ul>
        <% for (var placeholder in component.components) { %>
            <% if (component.components.hasOwnProperty(placeholder)) { %>
            <li>
                <div class="name-of-component--item">
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



### Raccourcis de Class pour nommage BEM ###

Il est possible également d'identifier votre classe maître sur un composant à l'aide de `class$` pour ne plus avoir besoin de la réécrire dans les sous partie pour gagner en visibilité. Votre classe maître sera obligatoirement la première de la classe. Ensuite, pour réécrire la classe maître dans les sous parties, il faudra utiliser `$`. Imaginons l'exemple suivant :

#### En dure ####

```html
<section class$="name-of-component and-other-class">
    <div class="ui">
        <div class="$--title">
            <h1><%- component.title %></h1>
        </div>
        <div class="$--content">
            <%- component.content.text %>
        </div>
        <div class="$--aside">
            <%- component.content.aside %>
        </div>
    </div>
</section>
```

avec ce Less:

```css
@componentName: e('.name-of-component');

@{componentName} {
    /* properties here */

    &--title {
        /* properties here */
    }
    &--content {
        /* properties here */
    }
    &--aside {
        /* properties here */
    }

    &.and-other-class {
        /* variable properties here */

        @{componentName} {
            &--title {
                /* variable properties here */
            }
            &--content {
                /* variable properties here */
            }
            &--aside {
                /* variable properties here */
            }
        }
    }
}
```

pour rendre la sortie suivante

```html
<section class="name-of-component and-other-class">
    <div class="ui">
        <div class="name-of-component--title">
            <h1><%- component.title %></h1>
        </div>
        <div class="name-of-component--content">
            <%- component.content.text %>
        </div>
        <div class="name-of-component--aside">
            <%- component.content.aside %>
        </div>
    </div>
</section>
```

#### Via fichier de variation ####

Il est également possible de prévoir l'injection d'une classe à partir du fichier de variation comme suit :

```json
{
    "components": {
        "placeholder": [{
            "path": "name-of-component.htm",
            "variation": {
                "componentName": "name-of-component"
            }
        }]
    }
}
```

```html
<section class="$ and-other-class">
    <div class="ui">
        <div class="$--title">
            <h1><%- component.title %></h1>
        </div>
        <div class="$--content">
            <%- component.content.text %>
        </div>
        <div class="$--aside">
            <%- component.content.aside %>
        </div>
    </div>
</section>
```

et même changer les classes de variation (ici `.and-other-class`) directement dans le fichier de variation en alimentant toutes les classes avec `$$` (seul la première classe sera ré-injectée dans les sous parties avec `$`).

```json
{
    "components": {
        "placeholder": [{
            "path": "name-of-component.htm",
            "variation": {
                "componentName": "name-of-component and-other-class"
            }
        }]
    }
}
```

```html
<section class="$$">
    <div class="ui">
        <div class="$--title">
            <h1><%- component.title %></h1>
        </div>
        <div class="$--content">
            <%- component.content.text %>
        </div>
        <div class="$--aside">
            <%- component.content.aside %>
        </div>
    </div>
</section>
```



### Intégrer ComponentAtlas à votre site NodeAtlas ###

Malgré le nombre de fichier dans cet exemple, le coeur même utile de ComponentAtlas pour vos propres sites node.js avec NodeAtlas se résume à un fichier et un appel.

#### Inclusion côté server ####

Il va falloir faire appel à une fonction provenant du fichier `components/controllers/sublime-atlas.js` dans votre controlleur commun pour permettre au moteur de template de reconnaître `includeComponents` comme dans cet exemple dans `controllers/common.js` :

```js
(function (publics) {
    "use strict";

    publics.changeVariation = function (params, mainCallback) {
        var variation = params.variation,
            NA = params.NA;

        variation = require('../components/controllers/sublime-atlas').includeComponents(variation, NA, "components", "mainTag", "componentName");

        mainCallback(variation);
    };

}(website));
```

Vous pouvez changer `mainTag` et `componentName` par une autre propriété les changeant lors de l'appel de la fonction et également mettre l'intégralité de vos composants ailleurs que dans `components`. Essayons par exemple `tag`, `name` et `placeholders` :

```js
variation = require('../components/controllers/sublime-atlas').includeComponents(variation, NA, "placeholders", "tag", "name");
```





## Utilisation avec EditAtlas ##

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

ComponentAtlas allow us to manage a website or HTML assets with nested Components with thanks to [NodeAtlas](http://www.lesieur.name/nodeatlas/). The website can be struct by piece of component just with modification into variation files (`.json`) in real time (no restart).

1. Component are not include with `include('name-of-component.htm')` but placeholders of components are setted with `includeComponents('componentsPlaceholder')`.

2. Each placeholder allow you to inject a list of components (and not just one).

3. Each component can be used its own set of `specific` variables.

4. Components can be include into components that can be include into components that can be...

5. The full tree of injected component are manage in real time via variation files.

6. Full compatibility with [EditAtlas](https://github.com/Haeresis/EditAtlas/) for edit in real time the components tree for modify the structure of page.

You can download this repository to test it or integrate it with any of your [NodeAtlas](http://www.lesieur.name/nodeatlas/) on node.js projects.



## How does it work ##

[NodeAtlas](http://www.lesieur.name/nodeatlas/) use an inclusion mechanism can be HTML parts to allow us to change easily your website structure.

The problem with `include` function is the path of file included is setted in hard way:

```html
<%- include("name-of-component.htm") %>
```

With a little tricks, its possible to not set the file included into template file but into variation file to inject « in the fly » the component:

```html
<%- include(specific.nameOfComponent) %>
```

We concluded quickly it will be cool :
- to correctly named and nested variation files for manage page.
- to include more one component if we want include a component in a placeholder.
- to manage set of `specific` variation by component and not just by template. It's allow us to include a component more one time in the same page with others variations.

```html
<% for (var i = 0; i < specific.component['firstComponentsPlaceholder'].length; i++) { %>
    <%- include(specific.component['firstComponentsPlaceholder'][i].nameOfComponent.path, specific.component['firstComponentsPlaceholder'][i].nameOfComponent.variation) %>
<% } %>
```

It's a good idea also to allow us to include component into component and use this mechanism with [EditAtlas](https://github.com/Haeresis/EditAtlas/) ! It's the job of ComponentAtlas.


### Include Components into a Template ###

It's possible with `includeComponents('componentsPlaceholder')`. For example:

With the following `templates/home.htm` template:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
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

and the following specific `variations/home.json` variation file:

```js
{
    "titleOfPage": "Title of the Page",
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

and the following `components/name-of-component.htm` component:

```html
<section class="name-of-component">
    <div class="ui">
        <h1><%- component.title %></h1>
        <%- component.content %>
    </div>
</section>
```

we could manage a page. Note that redefine list of component into placeholders allow us to change the structure of final page. Each time of a page is requested, the variation file is re-parsed and no restart is required.


### Include component from common variations ###

It's also possible to include components from common variation files `variations/common.js` for the components used on all or more one template.

For this, just use in second parameter the keyword `common`: `includeComponents('componentsPlaceholder', 'common')`. For example:

with the following `templates/home.htm` template:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="utf-8">
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

and the following `variations/home.json` specific variation:

```js
{
    "titleOfPage": "Title of the Page",
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

and the following `variations/common.json` common variation:

```js
{
    "titleOfPage": "Title of the Page",
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

and the following `components/name-of-component.htm` component:

```html
<section$ class="name-of-component">
    <div class="ui">
        <h1$><%- component.title %></h1$>
        <%- component.content %>
    </div>
</section$>
```

we could manage a page. We will see the `$` and `mainTag` in component file below.


### Modify Contextual Headers ###

It's a good idea to allow us to automaticly transform `<section>` into components by an other HTML5 tag or just a simple `<div>` because we will not use the same global tag by context.

In this case, it's interesting to transform `<section>` in `<div>` because it will be injected into a `<header>` or a `<footer>`.

The problem is double `<h1>` into `<header>`. The `<h1>` from template and the `<h1>` from component. ComponentAtlas allow you to resolve conflict in a simply way !

You have maybe seen in `components/name-of-component.htm` component the `$` into the `<section>` tag and into the `<h1>` tag. And you have maybe seen a `mainTag` variable for each component from `variations/common.json` file.


This `$` are remove from final HTML render if no `mainTag` are found into variation for the component. But if a `mainTag` exist, a list of transformations are executed.

That are the transformation:

- If exist `<nav$>...</nav$>`, `<aside$>...</aside$>`, `<section$>...</section$>`, `<article$>...</article$>` or `<div$>...</div$>` tags, it will be replaced by the tag specify into `mainTag`.
   *For example into our component: `<section$>...</section$>` become `<div>...</div>` because `mainTag` value is `div`.*

- If mainTag value is : `div`, `header` or `footer`, so all tags `<header$>...<header$>`, `<footer$>...</footer$>`, `<h1$>...</h1$>`, `<h2$>...</h2$>`, `<h3$>...</h3$>`, `<h4$>...</h4$>`, `<h5$>...</h5$>` or `<h6$>...</h6$>` will be respectively replaced by tags: `<div class="header-like" $>...<div>`, `<div class="footer-like" $>...</div>`, `<div class="h1-like">...</div>`, `<div class="h2-like">...</div>`, `<div class="h3-like">...</div>`, `<div class="h4-like">...</div>`, `<div class="h5-like">...</div>` or `<div class="h6-like">...</div>`.


### Include Components into Component ###

It's possible to include nested components in components to realize every structure of pages you want. For this, pass the `component` variable when you include a component : `<%- includeComponents('componentsPlaceholder', component) %>`.

*Note : it's still possible to inject a component from the root of `specific` or `common` variation files with `<%- includeComponents('componentsPlaceholder') %>` or `<%- includeComponents('componentsPlaceholder', 'common') %>`.*

For example :

with the following `templates/home.htm` template:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
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

and the following specific `variations/home.json` variation files:

```js
{
    "titleOfPage": "Title of the Page",
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

and the following specific `components/name-of-component.htm` composant:

```html
<section$ class="name-of-component">
    <div class="ui">
        <h1$><%- component.title %></h1$>
        <%- component.content %>
        <ul>
            <% if (component && component.components && component.components['item1']) { %>
            <li>
                <div class="name-of-component--item">
                    <%- includeComponents('item1', component) %>
                </div>
            </li>
            <% } %>
            <% if (component && component.components && component.components['item2']) { %>
            <li>
                <div class="name-of-component--item">
                    <%- includeComponents('item2', component) %>
                </div>
            </li>
            <% } %>
            <% if (component && component.components && component.components['item3']) { %>
            <li>
                <div class="name-of-component--item">
                    <%- includeComponents('item3', component) %>
                </div>
            </li>
            <% } %>
        </ul>
    </div>
</section$>
```

We can manage the page we want, with the desired containers and a perfect HTML5 semantic.

#### Loop of Component ####

The `components/name-of-component.htm` component from previous example could be a loop as following:

```html
<section$ class="name-of-component and-other-class">
    <div class="ui">
        <h1$><%- component.title %></h1$>
        <%- component.content %>
        <% if (component && component.components) { %>
        <ul>
        <% for (var placeholder in component.components) { %>
            <% if (component.components.hasOwnProperty(placeholder)) { %>
            <li>
                <div class="name-of-component--item">
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



### Class Shortcut for BEM naming ###

It's also possible to identify your main class for component with `class$` to not rewrite severals time name on the subcomponent. Your main class will be necessary the first class. Then, to re-inject main class into a subcomponent, use `$`. Let's see the exemple below:

#### Static ####

```html
<section class$="name-of-component and-other-class">
    <div class="ui">
        <div class="$--title">
            <h1><%- component.title %></h1>
        </div>
        <div class="$--content">
            <%- component.content.text %>
        </div>
        <div class="$--aside">
            <%- component.content.aside %>
        </div>
    </div>
</section>
```

with this Less:

```css
@componentName: e('.name-of-component');

@{componentName} {
    /* properties here */

    &--title {
        /* properties here */
    }
    &--content {
        /* properties here */
    }
    &--aside {
        /* properties here */
    }

    &.and-other-class {
        /* variable properties here */

        @{componentName} {
            &--title {
                /* variable properties here */
            }
            &--content {
                /* variable properties here */
            }
            &--aside {
                /* variable properties here */
            }
        }
    }
}
```

to obtain this output:

```html
<section class="name-of-component and-other-class">
    <div class="ui">
        <div class="name-of-component--title">
            <h1><%- component.title %></h1>
        </div>
        <div class="name-of-component--content">
            <%- component.content.text %>
        </div>
        <div class="name-of-component--aside">
            <%- component.content.aside %>
        </div>
    </div>
</section>
```

#### Variation file ####

It's also possible to inject a class via variation file like this:

```json
{
    "components": {
        "placeholder": [{
            "path": "name-of-component.htm",
            "variation": {
                "componentName": "name-of-component"
            }
        }]
    }
}
```

```html
<section class="$ and-other-class">
    <div class="ui">
        <div class="$--title">
            <h1><%- component.title %></h1>
        </div>
        <div class="$--content">
            <%- component.content.text %>
        </div>
        <div class="$--aside">
            <%- component.content.aside %>
        </div>
    </div>
</section>
```

and also to change all classes (here `.and-other-class`) into the variation file to re-inject thew with `$$` (and also re-inject first class into subcomponent with `$`).

```json
{
    "components": {
        "placeholder": [{
            "path": "name-of-component.htm",
            "variation": {
                "componentName": "name-of-component and-other-class"
            }
        }]
    }
}
```

```html
<section class="$$">
    <div class="ui">
        <div class="$--title">
            <h1><%- component.title %></h1>
        </div>
        <div class="$--content">
            <%- component.content.text %>
        </div>
        <div class="$--aside">
            <%- component.content.aside %>
        </div>
    </div>
</section>
```



### Embed ComponentAtlas to your NodeAtlas website ###

Despite the number of file in this example, the ComponentAtlas core useful for your own websites with node.js is a one file and one calling.

#### Server Side Inclusion ####

The feature you will run could be find into the `components/controllers/sublime-atlas.js` file. Use it in your common controller as following:

```js
(function (publics) {
    "use strict";

    publics.changeVariation = function (params, mainCallback) {
        var variation = params.variation,
            NA = params.NA;

        variation = require('../components/controllers/sublime-atlas').includeComponents(variation, NA, "components", "mainTag", "componentName");

        mainCallback(variation);
    };

}(website));
```

You can change `mainTag` and `componentName` with other value when you call the function and also set your component into a `components` parameter different. See this example with `tag`, `name` and `placeholders`:

```js
variation = require('../components/controllers/sublime-atlas').includeComponents(variation, NA, "placeholders", "tag", "name");
```





## Using with EditAtlas ##

With `path` object in addition of `component` deliver into an HTML component, you can know what set of variations component are currently in use from `specific` or `common` file. This is useful for [EditAtlas](https://github.com/Haeresis/EditAtlas/).

Just pass the `path` in same way of `component` when you include a component into a component: `<%- includeComponents('componentsPlaceholder', component, path) %>` (from a template, not set that).

You find utilisation example on the [EditAtlas repository](https://github.com/Haeresis/EditAtlas/).





## Run the website in local server ##

To run the website in local, you must install [NodeAtlas](http://www.lesieur.name/node-atlas/) on your development machine.

Then you move into the folder:


```
\> cd </path/to/blog>
```

and use the command:

```
\> node </path/to/>node-atlas/node-atlas.js --browse
```

or run `server.na` by double clicking and:
- explaining your OS that .na files are run by default with node,
- having installed node-atlas via npm install -g node-atlas
- being on your environment variable NODE_PATH is pointing to the global node_modules folder.

The website will be to:

- *http://localhost:7777/*