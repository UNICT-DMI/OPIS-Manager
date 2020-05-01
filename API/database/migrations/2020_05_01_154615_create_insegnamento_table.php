<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInsegnamentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /** Alaimo vi fustigherebbe per questo */
        
        /** PS: che merda Eloquent. ~ Lemuel */

        Eloquent::unguard();

        DB::statement(
            <<<SQL
                CREATE TABLE IF NOT EXISTS `insegnamento` (
                    `id`                INT(11) UNSIGNED NOT NULL ,
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
                    `id_cds`            INT(11) UNSIGNED NOT NULL,
                    PRIMARY KEY (
                        `id`, 
                        `anno_accademico`, 
                        `canale`, 
                        `id_cds`, 
                        `id_modulo`, 
                        `docente`, 
                        `assegn`, 
                        `tipo`, 
                        `anno`
                    ),
                    FOREIGN KEY (`id_cds`) REFERENCES `cds`(`id`)
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
        Schema::dropIfExists('insegnamento');
    }
}
