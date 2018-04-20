import { Component, Inject, forwardRef } from '@angular/core';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-footer',
  template: `
    <div class="footer">
        <div class="card clearfix">

          <span class="footer-text-left">
            Desenvolvido por Basis Tecnologia S.A. <a HREF="http://www.basis.com.br" TARGET="_blank">basis.com.br</a>
          </span>

          <span class="footer-text-right">
            <span class="ui-icon ui-icon-copyright"></span>
            <span>
              <a HREF="https://www.basis.com.br/nossos-produtos" TARGET="_blank">Clique aqui para ver a licença.</a>
            </span>
            <span>
              <app-version-tag class="footer-text-left"></app-version-tag>
            </span>
          </span>

        </div>
    </div>
  `
})

export class AppFooterComponent { }
