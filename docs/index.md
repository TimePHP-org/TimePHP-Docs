# Introduction to the TimePHP Framework

TimePHP, as mentioned in its name, is a PHP framework based on the MVC pattern. Unlike other frameworks, TimePHP is based on **components** which makes it extremely flexible. You can add several packages just by using the `composer` command line.

We've made this framework because we were tired of having to install an entire framework with a general purpose.

Rasmus Lerdorf once said 

> PHP frameworks suck. <br>
> Because everyone needs a framework but nobody needs a general purpose framework.

<br>
<br>

# Get started quickly

Get started by installing the TimePHP framework skeleton

```bash
composer create-project timephp/skeleton:0.0.1-alpha --prefer-dist application_name
```

Everything will be set up for you. The only thing you need to do is to navigate to you project and start your development server using the built-in PHP server.

```bash
php -S localhost:8080 -t App/public
```

This framework is also compatible with `Homestead`