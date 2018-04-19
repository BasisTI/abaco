import { Component, Inject, forwardRef } from '@angular/core';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-footer',
  template: `
    <div class="footer">
        <div class="card clearfix">

          <span class="footer-text-left">
            Desenvolvido por Basis Tecnologia S.A. / basis.com.br
          </span>

          <span class="footer-text-right">
            <span class="ui-icon ui-icon-copyright">
            </span>
            <span>
              Todos os direitos reservados
            </span>
          </span>

        </div>
    </div>
  `
})
export class AppFooterComponent { }
