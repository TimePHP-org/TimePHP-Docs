# Controllers

It could be really boring to define each route as a closure especially because there are less functionalities. In addition to this, controller can be used to make your code more organised, with a certain structure.

## File creation

Controller are located in the `App/Bundle/Controllers` folder but you don't need to create them by yourself. You can use the built-in cli provided by **TimePHP** with the following command :

```bash
php bin/cli make:controller
``` 
 and then provide the name of your controller.

This command will create the basic structure of a controller

```php
namespace App\Bundle\Controllers;
      
use TimePHP\Foundation\AbstractController;
      
class ControllerName extends AbstractController
{
   // code
}
```

> :memo: You don't have to use the cli to create a controller, you can simply copy the example above and paste it in a controller file in the `App/Bundle/Controllers` folder.

Then, when creating a new route, you will simply have to specify the controller and the corresponding function like this : 

```php
use App\Bundle\Controllers\ControllerName;

return [
   [
      // ...
      "controller" => ControllerName::class,
      "function" => "functionName"
   ]
];
```

## Route function

When creating a new route, if you're using the controller method instead of a closure, you need to specify a function from a controller and at the same time, create this new function.

```php
public function functionName() {
   // code
}
```

Depending on wether you have parameters in a route, the corresponding function will, in some cases, have parameters.

For example, if a url contains one parameter like this : `/article/[uuid:id]`, then the correcponding function have one parameter : 
```php
public function functionName(string $id) {
   // code
}
```

For more information about the `routing` part, check out the [Routing](core/routing.md) section, you will have all the details you need.