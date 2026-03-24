import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { QuestionService } from './questions.service';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { exampleQuestion } from '@mocks/question-mock';

const BASE_URL = 'https://api-opis.unictdev.org/api/v2/domande';

describe('[SERVICE] == Question', () => {
  let service: QuestionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(QuestionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('[LOAD_QUESTIONS_WEIGHTS]: Returns questions and sets questionWeights', () => {
    const questions = [exampleQuestion];

    service.loadQuestionsWeights().subscribe((result) => {
      expect(result).toEqual(questions);
      expect(service.questionWeights).toEqual(questions);
    });

    httpMock.expectOne(BASE_URL).flush(questions);
  });

  it('[LOAD_QUESTIONS_WEIGHTS]: Throws if response is empty array', () => {
    service.loadQuestionsWeights().subscribe({
      error: (err) => expect(err.message).toBe('Recupero dei pesi delle domande fallito'),
    });

    httpMock.expectOne(BASE_URL).flush([]);
  });

  it('[LOAD_QUESTIONS_WEIGHTS]: Throws if response is null', () => {
    service.loadQuestionsWeights().subscribe({
      error: (err) => expect(err.message).toBe('Recupero dei pesi delle domande fallito'),
    });

    httpMock.expectOne(BASE_URL).flush(null);
  });

  it('[LOAD_QUESTIONS_WEIGHTS]: Replays result without new HTTP call', () => {
    const questions = [exampleQuestion];

    service.loadQuestionsWeights().subscribe();
    httpMock.expectOne(BASE_URL).flush(questions);

    service.loadQuestionsWeights().subscribe((result) => {
      expect(result).toEqual(questions);
    });

    httpMock.expectNone(BASE_URL);
  });

  it('[UPDATE_QUESTION_WEIGHTS]: Sends PUT with correct body and auth header', () => {
    const token = 'Bearer test-token';
    const questions = [exampleQuestion];

    service.updateQuestionWeights(questions, token).subscribe();

    const expectedBody = JSON.stringify(
      questions.map((q) => ({ id: q.id, peso: q.peso_standard, gruppo: q.gruppo })),
    );
    const req = httpMock.expectOne(`${BASE_URL}?pesi_domande=${expectedBody}`);

    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe(token);

    req.flush({});
  });
});
