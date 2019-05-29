CREATE TABLE IF NOT EXISTS `dipartimento` (
    `id`               INT(11)          NOT NULL,
    `anno_accademico`  VARCHAR(9)       NOT NULL,
    `nome`             VARCHAR(255)     NOT NULL,
    `tot_cds`          INT(11)          NOT NULL,
    `tot_moduli`       INT(11)          NOT NULL,           -- tot. insegn/ moduli
    `tot_valutati`     INT(11)          NOT NULL,           -- insegnamenti valutati almeno da 1 studente (scheda1 o scheda3)
    `report`           INT(11)          DEFAULT NULL,       -- insegnamenti valutati almeno da 5 studenti (scheda1 o scheda3)
    `tot_schedeF`      INT(11)          NOT NULL,           -- valutazioni degli studenti frequentanti
    `tot_schedeNF`     INT(11)          NOT NULL,           -- valutazioni degli studenti non-frequentanti
    PRIMARY KEY (`id`, `anno_accademico`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `cds` (
    `id`                INT(11)         NOT NULL,       -- cod. corso
    `anno_accademico`   VARCHAR(9)      NOT NULL,
    `nome`              VARCHAR(255),
    `classe`            VARCHAR(255),
    `tot_moduli`        INT(11)         NOT NULL,       -- tot. insegn/ moduli
    `tot_valutati`      INT(11)         NOT NULL,       -- insegnamenti valutati almeno da 1 studente (scheda1 o scheda3)
    `report`            INT(11)         DEFAULT NULL,   -- insegnamenti valutati almeno da 5 studenti (scheda1 o scheda3)
    `tot_schedeF`       INT(11)         NOT NULL,       -- valutazioni degli studenti frequentanti
    `tot_schedeNF`      INT(11)         NOT NULL,       -- valutazioni degli studenti non-frequentanti
    `id_dipartimento`   INT(11)         NOT NULL,
    PRIMARY KEY (`id`, `anno_accademico`, `id_dipartimento`), -- (id_dipartimento)
    FOREIGN KEY (`id_dipartimento`) REFERENCES `dipartimento`(`id`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `insegnamento` (
    `id`                INT(11)         NOT NULL,       -- codice gomp
    `anno_accademico`   VARCHAR(9),
    `nome`              VARCHAR(255)    NOT NULL,
    `canale`            VARCHAR(10)     DEFAULT "no",
    `id_modulo`         VARCHAR(255)    DEFAULT "0",
    `ssd`               VARCHAR(40),
    `tipo`              VARCHAR(10)     DEFAULT "",
    `anno`              VARCHAR(10),
    `semestre`          VARCHAR(255),
    `CFU`               VARCHAR(255),
    `docente`           VARCHAR(255)    DEFAULT "",
    `assegn`            VARCHAR(20)     DEFAULT "",
    `tot_schedeF`       INT(11),
    `tot_schedeNF`      INT(11),
    `id_cds`            INT(11)         NOT NULL,
    PRIMARY KEY (`id`, `anno_accademico`, `canale`, `id_cds`, `id_modulo`, `docente`, `assegn`, `tipo`, `anno`), -- (`id_modulo`)
    FOREIGN KEY (`id_cds`) REFERENCES `cds`(`id`)
) DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `schede` (
    `totale_schede`      INT(11),
    `totale_schede_nf`   INT(11),
    `femmine`            INT(11),
    `femmine_nf`         INT(11)        DEFAULT NULL,
    `fc`                 INT(11),
    `inatt`              INT(11),
    `inatt_nf`           INT(11),
    `eta`                JSON,
    `anno_iscr`          JSON,
    `num_studenti`       JSON,
    `ragg_uni`           JSON,
    `studio_gg`          JSON,
    `studio_tot`         JSON,
    `domande`            JSON,
    `domande_nf`         JSON,
    `motivo_nf`          JSON,
    `sugg`               JSON,
    `sugg_nf`            JSON,
    `id_cds`             INT(11)        NOT NULL,
    `id_insegnamento`    INT(11)        NOT NULL,
    `id_modulo`          VARCHAR(255)   DEFAULT "0",
    `canale`             VARCHAR(255)   DEFAULT "no",
    `anno_accademico`    VARCHAR(9),
    PRIMARY KEY (`anno_accademico`, `canale`, `id_cds`, `id_insegnamento`, `id_modulo`),
    FOREIGN KEY (`id_insegnamento`) REFERENCES `insegnamento`(`id`),
    FOREIGN KEY (`id_cds`)          REFERENCES `cds`(`id`)
) DEFAULT CHARSET=utf8;
