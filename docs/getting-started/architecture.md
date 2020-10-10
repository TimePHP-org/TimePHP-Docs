# Architecture

Now that you have created your project, let's now give some details about the architecture. Those details will help you understand the actual framework purpose. As mentioned before, **TimePHP** is based on the `MVC` pattern which means that it will be easier to organize your app and make it grow.

## Hosting directory

### Entry point

The entry point for each request on your application is the directory `App/public` and more precisely the `index.php` file. <br>
All requests need to be redirected to this file. This can be done for an **Apache** configuration using the `.htaccess` file. For a **Nginx** configuration, because it is a server configuration, you will need to do it by yourself.

So, the `index.php` file contains the url that can be used on your application.

```php
require __DIR__ . "/../../vendor/autoload.php";
require __DIR__ . "/../../config/bootstrap.php";

use TimePHP\Foundation\Router;

$router = new Router($options, $twig->getRenderer());

$router->initialize($routes)->run();
```

This file contains the core functionalities to create the `Router` and all the things that make the framework works.

> :warning: Keep in mind that the `run` function is needed to run your router.

### Assets folder

This folder contains all the different files that can be accessible from the client : 

- Style file (css)
- Javascript (js)
- Images (logo, icons, ...)

Thoses files will be accessible from the `view` using the `asset` twig function.

## Bundle packages

This folder contains all the **main functionalities** of your application including :

- Controllers
- Entity
- Repository
- Services
- Views

During the development of your application, you will mainly spend your time in those folders.

### Controllers

Controllers contains the **logic** of your application. Send variable to the corresponding view, validate forms, make database query using repositories, ...

```php
namespace App\Bundle\Controllers;

use TimePHP\Foundation\Router;
use TimePHP\Foundation\AbstractController;

class HomeController extends AbstractController
{

    public function homeFunction(){

        return $this->render('home.twig', [
            "message" => "Hello World !"
        ]);

    }
 
}
```
You can easily create a controller using the [CLI](core/cli.md) which comes with the framework by typing :

```bash
php bin/cli make:controller
```

For more information about `controllers` and all the things you can do, check out the [Controller](core/controller.md) section.

### Entity

Entities make the link PHP objects and database table through the Eloquent ORM. Using entity, you can easily add records to your database.<br>
Each table in your database has its corresponding `Entity`.

```php
namespace App\Bundle\Entity;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class User extends Model {


   /**
    * The table associated with the model.
    *
    * @var string
    */
   protected $table = 'User';
   
   /**
    * The primary key associated with the table.
    *
    * @var string
    */
   protected $primaryKey = 'uuid';

   /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
   public $incrementing = false;

   /**
    * The "type" of the auto-incrementing ID.
    *
    * @var string
    */
   protected $keyType = 'string';

   /**
    * Indicates if the model should be timestamped.
    *
    * @var bool
    */
   public $timestamps = true;

   const CREATED_AT = 'createdAt';
   const UPDATED_AT = 'updatedAt';

   /**
    * Indicates fillable properties
    *
    * @var array
    */
   protected $fillable = ["username", "password", ...];


   public static function boot(){
      parent::boot();
      static::creating(function ($model) {
         if (! $model->getKey()) {
            $model->{$model->getKeyName()} = (string) Str::uuid();
         }
      });
   }
}
```

As you may have seen, **TimePHP** uses `uuid` instead of simple `id` to secure your data even more.<br>

You can create an entity using the [CLI](core/cli.md) by typing : 
```bash
php bin/cli make:entity
```

For more information about `Entity` and how to use them, checl out the [Entity](core/entity.md) section.


### Repository

**TimePHP** uses the repository design pattern. Those repositories contain database functions to prevent database query in controller.<br>
This design pattern can also be used to organize your application.

```php
namespace App\Bundle\Repository;

use App\Bundle\Entity\User;
use Illuminate\Database\Capsule\Manager;

class UserRepository {

   public function getAllUsers(){
      $users = User::all();
      return $users;
   }
   
}
```

Each `Entity` has its own `repository`. You don't have to create it, it's automatically created when you use the `make:entity` command.

For more information about `Repository`, please check out the [Repository](core/repository.md) section.

### Services

`Services` contain some specific functionalities such as, for instance : json convertion or generate random string.

A service in general look like this : 

```php
namespace App\Bundle\Services;

class MainService {

   public function function_name() {
      // ... functionality
   }

}
```

For more information about `Services`, check ou the [Services](core/service.md) section.

### Views

The `Views` directory contains all the interfaces that can be displayed to the user. **TimePHP** uses the **twig** template engine. It is robuste, easy to use and very flexible.

```html
{% extends "template/layout.twig" %}
{% block body %}

   <h1>{{ message }}</h1>

   {# {{ twig_function() }} #}

{% endblock %}
```
Each view need to extends the basic layout located in `template/layout`.

You can write basic html but also twig function like : 

```html
{% foreach user in users %}
   <p>{{ user.username }}</p>
{% endfor %}
```

Using twig, you can also write if/else statement.

You can easily create a `views` using the following command : 

```bash
php bin/cli make:view
```

For more information about `views`, check out the [Views](core/views.md) section

## Config folder

The `config` folder contains some options for your application. It contains :
- .env file
- option file

### Environment file

The `.env` file is used to store credentials or sensitive informations such as : database user and password, api token, ...

Developers can use this file to store those informations and then use them through the `$_ENV`global variable.

### Options

Because **TimePHP** does not necessarily fit your purposes, you can add options the your application.

You can add some options for your the router or for the twig renderer.

```php
return [
   "types" => [
      [
         "id" => "s",
         "regex" => "[a-z0-9]+(?:-[a-z0-9]+)*"
      ]
   ],
   "twig" => [
      [
         "name" => "hello",
         "function" => function() {
            return "hello world !";
         }
      ]
   ]
];
```

For more information about `Options`, check out the [option](core/options.md) section.

## Let's code

By reading this, you have now the key steps to use **TimPHP**. You can create a simple application using those informations.

You can now check the [full documentation](core/routing.md) in the core documentation.