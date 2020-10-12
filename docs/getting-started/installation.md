# Installation

## System requirements

Even if **TimePHP** is very lightweight, it still needs some PHP extensions.

- PHP &ge; 7.9
- MBString extension
- OpenSSL extension
- PDO for MySQL
- Composer
- Git

Each of these extensions are includes  the [Homestead](https://laravel.com/docs/8.x/homestead) box which makes it easier to create your futur website.

## Project creation

Using [composer](https://getcomposer.org/), you can simply type the `create-project` command on your terminal : 

```bash
composer create-project timephp/skeleton:0.0.9
```

If you want to rename the project before its creation, add the `--prefer-dist project_name` flag at the end of the previous command.

This command will create a **minimal version** of a TimePHP project and install all the dependencies that are needed including the core functionalities `timephp/timephp` and the database module `timephp/database`.