import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ModalRoute } from 'react-router-modal';

import BaseLineAnalitico from './base-line-analitico';
import BaseLineAnaliticoDetail from './base-line-analitico-detail';
import BaseLineAnaliticoDialog from './base-line-analitico-dialog';
import BaseLineAnaliticoDeleteDialog from './base-line-analitico-delete-dialog';

const Routes = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={match.url} component={BaseLineAnalitico} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/new`} component={BaseLineAnaliticoDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/delete`} component={BaseLineAnaliticoDeleteDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/edit`} component={BaseLineAnaliticoDialog} />
      <Route exact path={`${match.url}/:id`} component={BaseLineAnaliticoDetail} />
    </Switch>
  </div>
);

export default Routes;
