import { TranslateService } from '@ngx-translate/core';
import { Component, Inject, forwardRef } from '@angular/core';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-footer',
  template: `
    <div class="footer">
        <div class="card clearfix">

          <div class="ui-g-6 ui-md-6 ui-sm-12">
            <span class="footer-text-left">
              Desenvolvido por Basis Tecnologia S.A. <a HREF="http://www.basis.com.br" TARGET="_blank">basis.com.br</a>
            </span>
          </div>

          <div class="ui-g-6 ui-md-6 ui-sm-12">
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
    </div>
  `
})

export class AppFooterComponent {

  constructor(private translate: TranslateService) { };

}
