import { Component, OnInit, getDebugNode } from '@angular/core';
import { ConfigService, Config } from '../config.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  config: {
    apiUrl: string;
    years: string;
  };

  constructor(
    public configService: ConfigService,
    private http: HttpClient
    ) { }

  ngOnInit() {
    this.configService.getConfig()
    .subscribe((data: Config) => {
      this.config = {
        apiUrl: data.apiUrl,
        years: data.years
      };

      this.getDepartmnets();
    });

    // this.getDepartmnets();
    // $(document).ready(function() {
    //   $.getJSON(apiUrl + "dipartimento", function(data) {
    //     let dip = $("#dipartimenti");
    //     for (let i in data) {
    //       dip.append(new Option(data[i].nome, data[i].id));
    //     }
    //   });
    // });
  }

  getDepartmnets() {
    this.http.get(this.config.apiUrl + 'dipartimento').subscribe((data) => {
      console.log(data);
    });

    // let dip = $("#dipartimenti");
    // for (let i in data) {
    //   dip.append(new Option(data[i].nome, data[i].id));
    // }
  }



}
