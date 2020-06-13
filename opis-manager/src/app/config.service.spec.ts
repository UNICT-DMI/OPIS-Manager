import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      BrowserModule,
      HttpClientTestingModule,
    ]
  }));

  it('getConfig should correctly work', () => {
    const service: ConfigService = TestBed.inject(ConfigService);
    const httpTestingController = TestBed.inject(HttpTestingController);
    const urlConfig = 'assets/config.json';
    const mockConfig = {
      apiUrl: 'http://localhost/OPIS-Manager/API/public/index.php/api/',
      years: ['2013/2014', '2014/2015', '2015/2016', '2016/2017', '2017/2018', '2018/2019']
    };

    service.getConfig().subscribe();

    const req = httpTestingController.expectOne(urlConfig);
    expect(req.request.method).toEqual('GET');
    req.flush(mockConfig);
    httpTestingController.verify();
  });
});
