import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SongsApiClientService {

  constructor(private http: HttpClient) { }

  public getSongList(): Promise<any[]> {
    const url: string = `/api/songs`;
    return this.http
      .get(url).toPromise()
      .then(response => response as any[])
      .catch(this.handleError);
  }

  public getSongSearch(search: string): Promise<any[]> {
    const url: string = `/api/songs?search=${search}`;
    return this.http
      .get(url).toPromise()
      .then(response => response as any[])
      .catch(this.handleError);
  }

  public getSongData(id: string): Promise<any[]> {
    const url: string = `/api/song/${id}`;
    return this.http
      .get(url).toPromise()
      .then(response => response as any) // TODO Add "Song" type data construct
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong:', error);
    return Promise.reject(error.message || error);
  }
}
