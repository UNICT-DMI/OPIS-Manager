import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { GitHubService } from './github.service';
import { env } from '@env';
import { CacheEntry, GithubUser, GitUserView } from '@interfaces/github.interface';
import { CONTRIBUTOR_SOCIALS, REAL_NAMES } from '@values/contributors.value';

const REPO = 'OPIS-Manager';
const API_URL = `${env.github_api_url}/${REPO}/contributors`;
const CACHE_KEY = `contributors_${REPO}`;

const makeUser = (login: string, contributions: number): GithubUser =>
  ({ login, contributions, html_url: `https://github.com/${login}` }) as GithubUser;

const RAW_USERS: GithubUser[] = [
  makeUser('alice', 50),
  makeUser('bob', 30),
  makeUser('dependabot', 5),
];

const buildCache = (data: GitUserView[], ageMs = 0): string =>
  JSON.stringify({ timestamp: Date.now() - ageMs, data } as CacheEntry<GitUserView[]>);

describe('GitHubService', () => {
  let service: GitHubService;
  let http: HttpTestingController;

  beforeEach(() => {
    CONTRIBUTOR_SOCIALS.clear();
    REAL_NAMES.clear();
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(GitHubService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('[GITHUB SERVICE]: should create', () => {
    expect(service).toBeTruthy();
  });

  it('[GITHUB SERVICE]: contributors signal is empty on init', () => {
    expect(service.contributors()).toEqual([]);
  });

  it('[GET CONTRIBUTORS]: valid cache, return cached data without calling API', async () => {
    const cached: GitUserView[] = [
      {
        nick: 'alice',
        name: 'Alice',
        contributions: 50,
        github_profile: 'https://github.com/alice',
      },
    ];
    localStorage.setItem(CACHE_KEY, buildCache(cached, 1_000));

    const result = await service.getRepoContributors();

    http.expectNone(API_URL);
    expect(result).toEqual(cached);
  });

  it('[GET CONTRIBUTORS]: expired cache, call API', async () => {
    localStorage.setItem(CACHE_KEY, buildCache([], 31 * 60 * 1000));

    const promise = service.getRepoContributors();
    http.expectOne(API_URL).flush([]);
    await promise;
  });

  it('[GET CONTRIBUTORS]: malformed cache, call API', async () => {
    localStorage.setItem(CACHE_KEY, '%%%not-json%%%');

    const promise = service.getRepoContributors();
    http.expectOne(API_URL).flush([]);
    await promise;
  });

  it('[GET CONTRIBUTORS]: filter out users with "bot" in login', async () => {
    const promise = service.getRepoContributors();
    http.expectOne(API_URL).flush(RAW_USERS);

    const result = await promise;
    expect(result.map((u) => u.nick)).not.toContain('dependabot');
  });

  it('[GET CONTRIBUTORS]: sort by contributions descending', async () => {
    const promise = service.getRepoContributors();
    http.expectOne(API_URL).flush(RAW_USERS);

    const result = await promise;
    expect(result[0].contributions).toBeGreaterThanOrEqual(result[1].contributions);
  });

  it('[GET CONTRIBUTORS]: fallback to login when real name is missing', async () => {
    const promise = service.getRepoContributors();
    http.expectOne(API_URL).flush(RAW_USERS);

    const result = await promise;
    expect(result.find((u) => u.nick === 'bob')?.name).toBe('bob');
  });

  it('[GET CONTRIBUTORS]: save result to localStorage', async () => {
    const promise = service.getRepoContributors();
    http.expectOne(API_URL).flush(RAW_USERS);
    await promise;

    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY)!) as CacheEntry<GitUserView[]>;
    expect(parsed.data.length).toBe(2);
    expect(parsed.timestamp).toBeGreaterThan(0);
  });

  it('[GET CONTRIBUTORS]: contributions undefined, fallback to 0', async () => {
    const promise = service.getRepoContributors();
    http.expectOne(API_URL).flush([makeUser('ghost', undefined as any)]);

    const result = await promise;
    expect(result[0].contributions).toBe(0);
  });

  it('[GET CONTRIBUTORS]: login falsy, fallback nick to "Unknown"', async () => {
    const promise = service.getRepoContributors();
    http.expectOne(API_URL).flush([makeUser('', 1)]);

    const result = await promise;
    expect(result[0].nick).toBe('');
  });

  it('[GET CONTRIBUTORS]: HTTP 500, return empty array', async () => {
    const promise = service.getRepoContributors();
    http.expectOne(API_URL).flush(null, { status: 500, statusText: 'Server Error' });

    const result = await promise;
    expect(result).toEqual([]);
  });

  it('[GET CONTRIBUTORS]: HTTP 500, do not write to localStorage', async () => {
    const promise = service.getRepoContributors();
    http.expectOne(API_URL).flush(null, { status: 500, statusText: 'Server Error' });
    await promise;

    expect(localStorage.getItem(CACHE_KEY)).toBeNull();
  });
});
