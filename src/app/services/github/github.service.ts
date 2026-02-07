import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { env } from "@env";
import { CacheEntry, GithubUser, GitUserView } from "@interfaces/github.interface";
import { lastValueFrom } from "rxjs";

@Injectable({ providedIn: 'root' })
export class GitHubService {
  private readonly REPO_NAME = 'OPIS-Manager';
  private readonly BASE_URL = env.github_api_url + '/' + this.REPO_NAME;
  private readonly _http = inject(HttpClient);

  private cacheTTL = 0.5 * 60 * 60 * 1000; // 30 min

  public contributors = signal<GitUserView[]>([]);

  public async getRepoContributors(): Promise<GitUserView[]> {
    const cacheKey = `contributors_${this.REPO_NAME}`;
    const cachedRaw = localStorage.getItem(cacheKey);
    const now = Date.now();

    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw) as CacheEntry<GitUserView[]>;
        if (now - cached.timestamp < this.cacheTTL) {
          return cached.data;
        }
      } catch {
        console.warn('No cache founded or expired, calling api');
      }
    }

    const url = `${this.BASE_URL}/contributors`;
    try {
      const contributors = await lastValueFrom(this._http.get<GithubUser[]>(url));
      const noBots = contributors.filter(user => !user.login.includes('bot'))
      const mapped = noBots.map(user => ({
        nick: user.login ?? 'Unknown',
        name: '',
        contributions: user.contributions ?? 0,
        github_profile: user.html_url
      }));
      const sorted = mapped.sort(
        (userA, userB) => userB.contributions - userA.contributions
      );
      localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data: sorted }));
      return sorted;
    } catch (err) {
      console.error(`Errore nel recuperare i contributors di ${this.REPO_NAME}`, err);
      return [];
    }
  }


}