import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaArrowLeft } from 'react-icons/lib/fa';

import { getEntity } from './base-line-sintetico.reducer';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface IBaseLineSinteticoDetailProps {
  getEntity: ICrudGetAction;
  baseLineSintetico: any;
  match: any;
}

export class BaseLineSinteticoDetail extends React.Component<IBaseLineSinteticoDetailProps> {

  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { baseLineSintetico } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="abacoApp.baseLineSintetico.detail.title">BaseLineSintetico</Translate> [<b>{baseLineSintetico.id}</b>]
        </h2>
        <dl className="row-md jh-entity-details">
          <dt>
            <span id="idsistema">
              <Translate contentKey="abacoApp.baseLineSintetico.idsistema">
              idsistema
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineSintetico.idsistema}
          </dd>
          <dt>
            <span id="sigla">
              <Translate contentKey="abacoApp.baseLineSintetico.sigla">
              sigla
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineSintetico.sigla}
          </dd>
          <dt>
            <span id="nome">
              <Translate contentKey="abacoApp.baseLineSintetico.nome">
              nome
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineSintetico.nome}
          </dd>
          <dt>
            <span id="numeroocorrencia">
              <Translate contentKey="abacoApp.baseLineSintetico.numeroocorrencia">
              numeroocorrencia
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineSintetico.numeroocorrencia}
          </dd>
          <dt>
            <span id="sum">
              <Translate contentKey="abacoApp.baseLineSintetico.sum">
              sum
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineSintetico.sum}
          </dd>
        </dl>
        <Button tag={Link} to="/base-line-sintetico" replace color="info">
          <FaArrowLeft/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.back">Back</Translate></span>
        </Button>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
    baseLineSintetico: storeState.baseLineSintetico.entity
});

const mapDispatchToProps = { getEntity };

export default connect(mapStateToProps, mapDispatchToProps)(BaseLineSinteticoDetail);
