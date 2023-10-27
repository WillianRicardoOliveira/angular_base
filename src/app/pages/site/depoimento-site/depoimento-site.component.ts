import { Depoimento } from '@/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { DepoimentoService } from '@services/site/depoimento/depoimento.service';

@Component({
  selector: 'app-depoimento-site',
  templateUrl: './depoimento-site.component.html',
  styleUrls: ['./depoimento-site.component.scss']
})
export class DepoimentoSiteComponent implements OnInit {

  depoimentos: Depoimento[] = [];

  constructor(private service: DepoimentoService) {}

  ngOnInit(): void {   

    this.service.listar().subscribe(
      res => {
        this.depoimentos = res;
      }
    )

  }

}
