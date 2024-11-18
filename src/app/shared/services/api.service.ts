import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "../../../environments/environment";
import { User } from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private _token?: string;
  private _user?: User;
  isInit: boolean = false;
  initEvent: Subject<boolean> = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.init();
  }

  get token(): string | undefined {
    return this._token;
  }

  private set token(value: string | undefined) {
    this._token = value;
  }

  get user(): User | undefined {
    return this._user;
  }

  private set user(value: User | undefined) {
    this._user = value;
  }

  public async init() {
    // Récupère le code dans l'url
    let urlParams = new URLSearchParams(window.location.search);

    // S'il y a un code dans l'url, on effectue une requête pour récupérer le token
    if (urlParams.has('code')) {
      const code = urlParams.get('code') as string;

      // Effectue la requête sur le callback de l'API
      const res = await this.requestApi('/auth/callback', 'GET', { code });
      if (res && res.access_token) {
        this.saveToken(res.access_token);
        await this.getUser();
        await this.router.navigate(['/']);
      }
    } else {
      // Sinon on récupère le token dans le localStorage s'il existe
      this.token = localStorage.getItem('token')
        ? JSON.parse(localStorage.getItem('token')!).token
        : undefined;

      if (this.token) {
        await this.getUser();
      }
    }

    // On indique que l'initialisation est terminée
    this.isInit = true;
    this.initEvent.next(true);
  }

  public async requestApi(action: string, method: string = 'GET', data: any = {}, httpOptions: any = {}): Promise<any> {
    const methodWanted = method.toLowerCase();
    let route = environment.apiUrl + action;
    let req = null;

    // Si pas de headers, on en crée qui demande du json
    if (httpOptions.headers === undefined) {
      httpOptions.headers = new HttpHeaders({
        'Accept': 'application/json',
      });
    }

    // Si token présent, on l'ajoute dans le header
    if (this.token) {
      httpOptions.headers = httpOptions.headers.set(
        'Authorization',
        'Bearer ' + this.token
      );
    }

    switch (methodWanted) {
      case 'post':
        req = this.http.post(route, data, httpOptions);
        break;
      case 'put':
        req = this.http.put(route, data, httpOptions);
        break;
      case 'delete':
        route += '?' + Object.keys(data)
          .map(key => key + '=' + data[key])
          .join('&');
        req = this.http.delete(route, httpOptions);
        break;
      default:
        route += '?' + Object.keys(data)
          .map(key => key + '=' + data[key])
          .join('&');
        req = this.http.get(route, httpOptions);
        break;
    }

    return req.toPromise();
  }

  // Sauvegarde le token dans le localStorage
  saveToken(token: string) {
    localStorage.setItem('token', JSON.stringify({
      token: token,
    }));
    this.token = token;
  }

  // Récupère les données de l'utilisateur connecté
  async getUser() {
    const data = await this.requestApi('/user');
    if (data) {
      this.user = data;
    }
  }

  // Vérifie si l'utilisateur est connecté
  isLogged(): boolean {
    return this.token !== undefined;
  }

  // Déconnecte l'utilisateur
  async logout() {
    await this.requestApi('/auth/logout', 'POST');
    localStorage.removeItem('token');
    this.token = undefined;
    this.user = undefined;
    await this.router.navigate(['/login']);
  }

  // Redirige vers GitHub pour l'authentification
  async redirectToGithub() {
    const res = await this.requestApi('/auth/redirect');
    if (res && res.url) {
      window.location.href = res.url;
    }
  }
}