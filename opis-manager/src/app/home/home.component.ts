import { Component, OnInit, getDebugNode } from '@angular/core';
import { ConfigService, Config } from '../config.service';
import { HttpClient } from '@angular/common/http';
import { Identifiers } from '@angular/compiler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  config: {
    apiUrl: string;
    years: any;
  } = {
    apiUrl: '',
    years: []
  };

  departments: any = [];
  cds: any = [];
  teachings: any = [];

  selectedCds: number;
  currentOption: number;

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
  }

  getDepartmnets() {
    this.http.get(this.config.apiUrl + 'dipartimento').subscribe((data) => {
      this.departments = data;
    });
  }

  showCds(department: number) {
    this.http.get(this.config.apiUrl + 'cds/' + department).subscribe((data) => {
      this.cds = data;
    });
  }

  selectCds(cds: number) {
    this.selectedCds = cds;

    this.http.get(this.config.apiUrl + 'insegnamento/' + cds).subscribe((data) => {
      this.teachings = data;
    });
  }

  enableOption(val) {
    this.currentOption = val;
  }


}
