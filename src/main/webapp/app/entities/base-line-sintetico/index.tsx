import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ModalRoute } from 'react-router-modal';

import BaseLineSintetico from './base-line-sintetico';
import BaseLineSinteticoDetail from './base-line-sintetico-detail';
import BaseLineSinteticoDialog from './base-line-sintetico-dialog';
import BaseLineSinteticoDeleteDialog from './base-line-sintetico-delete-dialog';

const Routes = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={match.url} component={BaseLineSintetico} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/new`} component={BaseLineSinteticoDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/delete`} component={BaseLineSinteticoDeleteDialog} />
      <ModalRoute exact parentPath={match.url} path={`${match.url}/:id/edit`} component={BaseLineSinteticoDialog} />
      <Route exact path={`${match.url}/:id`} component={BaseLineSinteticoDetail} />
    </Switch>
  </div>
);

export default Routes;
