<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDipartimentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dipartimento', function (Blueprint $table) {

            $table->integer('id', false, 11); 
            
            $table->string('anno_accademico', 9); 
            
            $table->string('nome', 255); 

            $table->integer('tot_cds', false, 11);         

            $table->integer('tot_moduli', false, 11);
            
            $table->integer('tot_valutati', false, 11);    
            
            $table->integer('report', false, 11)           
                ->nullable()->default(NULL);     
            
            $table->integer('tot_schedeF', false, 11);     
            
            $table->integer('tot_schedeNF', false, 11);    

            $table->primary(['id', 'anno_accademico']); 

            $table->engine = 'InnoDB';
            
            $table->charset = 'utf8mb4';
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dipartimento');
    }
}
