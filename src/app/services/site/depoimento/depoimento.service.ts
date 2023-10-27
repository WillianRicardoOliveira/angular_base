import { Injectable, OnInit } from '@angular/core';
import { BaseService } from '@services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class DepoimentoService {

  constructor(private service: BaseService) {}

  listar(){
    return this.service.listar("depoimento")
  }

}
