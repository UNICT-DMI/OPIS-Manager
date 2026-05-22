import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { env } from '@env';
import { CacheEntry, GithubUser, GitUserView } from '@interfaces/github.interface';
import { CONTRIBUTOR_SOCIALS, REAL_NAMES } from '@values/contributors.value';
import { lastValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GitHubService {
  private readonly REPOS = ['OPIS-Manager', 'opis-manager-core', 'opis-manager-scraper'];
  private readonly CACHE_KEY = `contributors_${this.REPOS.join('_')}`;
  private readonly _http = inject(HttpClient);

  private cacheTTL = 0.5 * 60 * 60 * 1000; // 30 min

  readonly contributors = signal<GitUserView[]>([]);

  async getRepoContributors(): Promise<GitUserView[]> {
    const now = Date.now();
    const cachedRaw = localStorage.getItem(this.CACHE_KEY);

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

    const results = await Promise.all(this.REPOS.map((repo) => this._fetchRepoContributors(repo)));
    const allContributors = results.flat();

    if (allContributors.length === 0) {
      return [];
    }

    const merged = new Map<string, GithubUser>();
    for (const user of allContributors) {
      const key = (user.login ?? '').toLowerCase();
      const existing = merged.get(key);
      if (existing) {
        existing.contributions = (existing.contributions ?? 0) + (user.contributions ?? 0);
      } else {
        merged.set(key, { ...user });
      }
    }

    const noBots = Array.from(merged.values()).filter((user) => !user.login.includes('bot'));
    const mapped = noBots.map((user) => {
      const socials = CONTRIBUTOR_SOCIALS.get(user.login.toLowerCase()) ?? {};
      return {
        nick: user.login ?? 'Unknown',
        name: REAL_NAMES.get(user.login.toLowerCase()) ?? user.login,
        contributions: user.contributions ?? 0,
        github_profile: user.html_url,
        ...socials,
      };
    });

    const sorted = mapped.sort((userA, userB) => userB.contributions - userA.contributions);
    localStorage.setItem(this.CACHE_KEY, JSON.stringify({ timestamp: now, data: sorted }));
    return sorted;
  }

  private async _fetchRepoContributors(repo: string): Promise<GithubUser[]> {
    const url = `${env.github_api_url}/${repo}/contributors`;
    try {
      return await lastValueFrom(this._http.get<GithubUser[]>(url));
    } catch (err) {
      console.error(`Errore nel recuperare i contributors di ${repo}`, err);
      return [];
    }
  }
}
