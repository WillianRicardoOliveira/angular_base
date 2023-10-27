import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { BaseService } from '@services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
/*
  private cache$?: Observable<Estado[]>;

  constructor(private service: BaseService) {}

  listar() : Observable<Estado[]> {
    if (!this.cache$) {
      this.cache$ = this.requestEstados().pipe(
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  private requestEstados(): Observable<Estado[]> {
    return this.service.listar("estado")
  }
  */
}
