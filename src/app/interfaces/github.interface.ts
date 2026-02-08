export interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

export interface GithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  contributions: number;
}

export interface GitUserView {
  nick: string;
  contributions: number;
  email?: string;
  linkedin?: string;
  telegram?: string;
  name?: string;
  github_profile?: string;
}
