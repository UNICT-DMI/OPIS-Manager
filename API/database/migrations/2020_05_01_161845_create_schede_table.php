<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSchedeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /** Eloquent gnafà proprio! ~ Lemuel */

        Eloquent::unguard();

        DB::statement(
            <<<SQL
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
                    `id_cds`             INT(11) UNSIGNED NOT NULL,
                    `id_insegnamento`    INT(11) UNSIGNED NOT NULL,
                    `id_modulo`          VARCHAR(255) DEFAULT "0",
                    `canale`             VARCHAR(255) DEFAULT "no",
                    `anno_accademico`    VARCHAR(9),
                    PRIMARY KEY (
                        `anno_accademico`, 
                        `canale`, 
                        `id_cds`, 
                        `id_insegnamento`, 
                        `id_modulo`
                    ),
                    FOREIGN KEY (`id_insegnamento`) REFERENCES `insegnamento`(`id`),
                    FOREIGN KEY (`id_cds`)          REFERENCES `cds`(`id`)
                ) DEFAULT CHARSET=utf8mb4;
            SQL
        );

        Eloquent::reguard();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('schede');
    }
}
