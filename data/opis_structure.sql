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

CREATE TABLE IF NOT EXISTS `schede` (
    `id` INT(11) PRIMARY KEY NOT NULL,
    `totale_schede` INT(11),
    `totale_schede_nf` INT(11),
    `femmine` INT(11),
    `femmine_nf` INT(11) DEFAULT NULL,
    `fc` INT(11),
    `fc_nf` INT(11),
    `inatt` INT(11),
    `inatt_nf` INT(11),
    `domande` TEXT,
    `domande_nf` TEXT,
    `motivo_nf` TEXT,
    `sugg` TEXT,
    `sugg_nf` TEXT
);

CREATE TABLE IF NOT EXISTS `schede_dettagli` (
    `eta_18_19` FLOAT(11),
    `eta_20_21` FLOAT(11),
    `eta_22_23` FLOAT(11),
    `eta_24_25` FLOAT(11),
    `eta_26_27` FLOAT(11),
    `eta_28_29` FLOAT(11),
    `eta_30_oltre` FLOAT(11),
    `anno_1` FLOAT(11),
    `anno_2` FLOAT(11),
    `anno_3` FLOAT(11),
    `anno_4` FLOAT(11),
    `anno_5` FLOAT(11),
    `anno_6` FLOAT(11),
    `anno_fc` FLOAT(11),
    `tm_0_5` FLOAT(11),
    `tm_1_2` FLOAT(11),
    `tm_2_3` FLOAT(11),
    `tm_3_oltre` FLOAT(11),
    `ore_1` FLOAT(11),
    `ore_2` FLOAT(11),
    `ore_3` FLOAT(11),
    `ore_4` FLOAT(11),
    `ore_5` FLOAT(11),
    `ore_6` FLOAT(11),
    `ore_7` FLOAT(11),
    `ore_8` FLOAT(11),
    `ore_9` FLOAT(11),
    `ore_10` FLOAT(11),
    `ore_e_50` FLOAT(11),
    `ore_e_51_100` FLOAT(11),
    `ore_e_101_150` FLOAT(11),
    `ore_e_151_200` FLOAT(11),
    `ore_e_201_250` FLOAT(11),
    `ore_e_251_300` FLOAT(11),
    `ore_e_301_350` FLOAT(11),
    `ore_e_350_oltre` FLOAT(11)
);
