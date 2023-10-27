import { Conteudo } from '@/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';
import { ConteudoService } from '@services/site/conteudo/conteudo.service';

@Component({
  selector: 'app-conteudo-site',
  templateUrl: './conteudo-site.component.html',
  styleUrls: ['./conteudo-site.component.scss']
})
export class ConteudoSiteComponent implements OnInit {
  
  conteudos: Conteudo[] = [];
  
  constructor(private service: ConteudoService) {}

  ngOnInit(): void {
    
    this.service.listar().subscribe(
      res => {
        this.conteudos = res;
      }
    )
    
  }

}
