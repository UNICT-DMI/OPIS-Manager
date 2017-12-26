CREATE TABLE IF NOT EXISTS `dipartimento` (
    `id` INT(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `tot_moduli` INT(11) NOT NULL,
    `tot_valutati` INT(11) NOT NULL,
    `tot_schedeF` INT(11) NOT NULL,
    `tot_schedeNF` INT(11) NOT NULL,
    `id_opis` INT(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS `cds` (
    `id` INT(11) PRIMARY KEY NOT NULL,
    `name` VARCHAR(255),
    `class` VARCHAR(255),
    `tot_moduli` INT(11) NOT NULL,
    `tot_valutati` INT(11) NOT NULL,
    `tot_schedeF` INT(11) NOT NULL,
    `tot_schedeNF` INT(11) NOT NULL,
    `id_dipartimento` INT(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS `insegnamento` (
    `id` INT(11) PRIMARY KEY NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `canale` VARCHAR(255),
    `ssd` VARCHAR(255),
    `tipo` VARCHAR(255),
    `anno` INT(11),
    `semestre` INT(11),
    `CFU` INT(11),
    `docente` VARCHAR(255),
    `assegn` VARCHAR(255),
    `id_cds` INT(11) NOT NULL
);
