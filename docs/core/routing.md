# Routing

By default, every url will be redirected to the `App/public/index.php` file so that each of them can be processed correctly.

You can find the list of each routes in the `web/routes.php` file. When creating a new route, you will need to provide some fields : 

- The **method** used by this route : `get` or `post` **[required]**
- The **url** (must start with a `/`. Can contain arguments with custom types) **[required]**
- The url **type**, either `web` or `api` (for the `api` type, you will need to install the `timephp/rest` package) **[optional, default : `web`]**
- The **route name** (this name will be used the generate those url from its name) **[required]**
- A **prefix** (must start with a `/`) **[optional, default for api type : `/api`]**
- A **controller** (must be an in instance of the class) **[optional if you're using a closure, otherwise required]**
- A **function** (can be a function from a controller or a closure) **[required]**

As mentionned earlier, you can define a new route by using either a **controller and one its functions** or a **closure**

## Basic routing

In most cases, you will begin by defining a `get` route. You can use one of the two examples below to create one. In both cases, those routes will be accessible from your web browser. For instance, let's assume that you have a route with `/home` as url, this route will then be accessible by navigating to `http://localhost:8080/home`

### Controller and function

The following example shows you the minimal version of a route using a controller.

```php
use App\Bundle\Controllers\HomeController;

return [
   [
      "method" => "get", // post
      "url" => "/",
      "name" => "home",
      "controller" => HomeController::class,
      "function" => "homePage"
   ]
];
```

### Closure

Instead of using a controller with a function, you could also associate a `closure` for the `function` field. This way, the `controller` field will not be required anymore.

```php
return [
   [
      "method" => "get",
      "url" => "/",
      "name" => "home",
      "function" => function() {
         echo "Hello world !";
      }
   ]
];
```

This method can be used to test some routes or debbug things or variables

> :warning: You can not use this way to render twig files. This is possible with controller only

## Route parameters

**TimePHP** comes with a route parameters system. In other words, you can add parameters to the url. Those parameters will be automatically injected to the corresponding closure or controller function.

If the parameter type is not respected, **TimePHP** will return a 404 error.

### Default parameters

You can use the default parameters type : 
- `i` : Numbers _(regex : [0-9]+)_
- `a` : Letters and numbers _(regex : [0-9A-Za-z]+)_
- `h` : Hexadecimal string _(regex : [0-9A-Fa-f]+)_
- `*` : Everything _(regex : .*)_

To define a url parameter, you have to indicate the type then a name for this parameter.

> Exemple : [i:number] or [a:username]

Then, each type can be used in the url like this : 

```php
[
   "method" => "get",
   "url" => "/[i:number]",
   "name" => "home",
   "controller" => HomeController::class,
   "function" => "homePage"
]
```

In order to retrieve this parameters, the controller function need the have the same number of arguments than the number of parameters in the url. They also need to have the same name.

```php
public function homePage(int $number) {
   return $this->render("home.twig", [
      "number" => $number
   ]);
}
```

For closures, the same process is needed

```php
[
   "method" => "get",
   "url" => "/[i:number]",
   "name" => "home",
   "function" => function(int $number) {
      echo $number;
   }
]
```

In both cases, the number passed in the url will be sent to the view.

### Custom parameters

You can also create your own type to best match your goal. To create a new type, you need to, first, navigate to the `config/options.php` file and then, add  it to the `types` fields like this.

```php
return [
   "types" => [
      [
         "id" => "uuid",
         "regex" => "[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}",
      ]
   ],
   "twig" => [
      // ...
   ],
];
```

This example shows you how to create a *uuid* type but you can create the one that you want with the corresponding *regex*.

Once it is done, this new type will be available when creating a new url.

```php
[
   "method" => "get",
   "url" => "/[uuid:id]",
   "name" => "home",
   "function" => function(string $id) {
      echo $id;
   }
]
```

## Prefix

Prefixes can be used to regroup routes and put a prefix behind them.

To add a prefix to a url, you just need to specify the `prefix` field to the route like this : 

```php
[
   "method" => "get",
   "url" => "/",
   "name" => "home",
   "prefix" => "/user",
   // ...
]
```

In this example, the prefix `/user` will be added to the url `/`. The url will now become `/user/` or `/user` (The last `/` is automatically removed)

By default, web routes don't have prefixes but api routes have the prefix `/api` but you can override it by redefining the `prefix` field.

## Routing functions

Routing function are only available in controller functions and twig views.

### Controller routing functions

#### Redirect using a specific url

In a controller function you can redirect the request to another url using the function `redirectUrl`.

```php
$this->redirectUrl("http://www.example.com");
```

#### Redirect using a route name

You can also redirect the request to a url that comes from your application using the route name.

Assuming that you have a route called `home` that is linked to the url `/home` without any parameters in the url. You can now redirect the user to the route called `home` using the `redirectRouteName` function.

```php
$this->redirectRouteName("home");
```

##### Parameters


In case the url contains parameters like `/article/[uuid:id]` , you can specify them using the second function parameter like this

```php
$this->redirectRouteName("home", [
   "id" => "123e4567-e89b-12d3-a456-426614174000"
], [
   // ...
]);
```

This function will redirect the user to the url `/article/123e4567-e89b-12d3-a456-426614174000`.

##### Flags

But you can also add flags to the url by passing an array as a function argument.

```php
$this->redirectRouteName("home", [], [
   "message" => "hello",
   "username" => "John doe"
]);
```

This function will redirect the user to the url `/home?message=hello&username=John%20doe`.

### Views routing functions

In a twig view, you can only generate url from a route name.

This is possible using the twig function `generate`.

```html
{{ generate('home') }}
```

As for controllers, you can specify parameters and flags using twig arrays like this

```html
{{ generate('home', {
   uuid: '123e4567-e89b-12d3-a456-426614174000'
}, {
   message: hello,
   username: 'John doe'
}) }}
```

> :warning: The function `generate` will generate the url, it will not redirect the user automatically. You have to put it a `href` attribut.