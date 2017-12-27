import Rx from 'rxjs';
import axios from 'axios';

export default class RxHttpClient {
  constructor(baseUrl){
    this.baseUrl = baseUrl || '';
  }

  get(path, config){
    const url = this.makeUrl(path);
    return Rx.Observable.fromPromise(axios.get(url, config));
  }

  post(path, data, config){
    const url = this.makeUrl(path);
    return Rx.Observable.fromPromise(axios.post(url, data, config));
  }

  makeUrl(path){
    return `${this.baseUrl}${path}`;
  }
}