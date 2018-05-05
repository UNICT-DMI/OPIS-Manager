# OPIS-Manager
This tool performs the data visualization of the OPIS results.

[Live Demo](http://188.213.170.165/OPIS-Manager/)

# Requirements

- **AMP** (Apache2, MySQL, PHP)
- [composer](https://getcomposer.org/doc/00-intro.md)


## Install AMP

This project to run need: PHP, MySQL, a webserver (like Apache2).
This requirements are satisfied by the software stack *\*AMP*:

- LAMP for Linux
- MAMP for Mac
- XAMPP/WAMP/EasyPHP and similar for Windows

### -  Linux

In a linux distro debian-based the package tasksel can install the meta-package LAMP easily, so install tasksel with:
```
$ sudo apt install tasksel
$ sudo tasksel
```

Select "LAMP" (use the key arrows and the keybutton "space" to select the option), press TAB and install LAMP.

### - Mac

[Here](https://www.mamp.info/en/downloads/) the download link of MAMP.
MAMP can be installed by [hombrew](https://gist.github.com/alanthing/4089298)

### - Windows

Download [EasyPHP](http://www.easyphp.org/download.php)

### Alternative (cross-platform)
- [XAMPP](https://www.apachefriends.org/download.html)
- [WAMP](http://www.wampserver.com/en/)


--- 

## Import the database structure

If you just installed *AMP and have no mysql database, create one with:
```
$ mysql -u root -p
$ CREATE DATABASE db_name;
$ exit;
```

In the *database* directory there is the sql structure of the database in *opis_structure.sql*, so import it into your database with:

```
$ mysql -u root -p db_name < project/path/OPIS-Manager/database/opis_structure.sql
```

--- 

## How to use the scrapers

The tools in the scrapers directory can extract the public OPIS data from the [official site](http://www.rett.unict.it/nucleo/val_did/anno_1617/) of the University of Catania.

To use them go to scrapers, copy the file **config.php.dist** into **config.php** and configure it for the database mysql.

Well, run the main file **dipartimento.php**, it will extract the opis data and it will import them in the database.
You can run it from the terminal with:

```
$ php dipartimento.php
```

--- 

## Install the API

To install the Laravel API, run the setup_api.sh, it will change the permissions of some files inside the API directory and create the *.env* file.

```
$ sh setup_api.sh
```

Configure the database parameters opening the file **API/.env**

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=database_name
DB_USERNAME=username
DB_PASSWORD=password
```

Go to the API directory and use composer to download and install the dependencies:

```
$ cd API
$ composer install
```

Run this command to fill the APP_KEY parameter:
```
php artisan key:generate
```

Now your OPIS-Manager should be installed.
You can run the browser and test it!
