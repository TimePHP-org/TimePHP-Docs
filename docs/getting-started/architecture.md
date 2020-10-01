# Architecture

Now that you have created your project, let's now give some details about the architecture. Those details will help you understand the actual framework purpose. As mentioned before, **TimePHP** is based on the `MVC` pattern which means that it will be easier to organize your app and make it grow.

## Hosting directory

### Entry point

The entry point for each request on your application is the directory `App/public` and more precisely the `index.php` file. <br>
All requests need to be redirected to this file. this can be done for an **Apache** configuration using the `.htaccess` file. For a **Nginx** configuration, because it is a server configuration, you will need to do it by yourself.

<br>
<br>

So, the `index.php` file contains the url that can be used on your application.

```php
use TimePHP\Foundation\Router;

$router = new Router();

$router
    ->get("/", "HomeController#homeFunction", "home")
    ->run();
```

You can define a new url by using the `get` or `post` method on the `$router` object, depending on the context. <br>
For more information about how to create a new route, take a look at the [Routing](foundations/routing.md) documentation.

> :warning: Keep in mind that the `run` function is need to run your router.

### Assets folder

