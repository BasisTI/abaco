import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaArrowLeft } from 'react-icons/lib/fa';

import { getEntity } from './base-line-analitico.reducer';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface IBaseLineAnaliticoDetailProps {
  getEntity: ICrudGetAction;
  baseLineAnalitico: any;
  match: any;
}

export class BaseLineAnaliticoDetail extends React.Component<IBaseLineAnaliticoDetailProps> {

  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { baseLineAnalitico } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="abacoApp.baseLineAnalitico.detail.title">BaseLineAnalitico</Translate> [<b>{baseLineAnalitico.id}</b>]
        </h2>
        <dl className="row-md jh-entity-details">
          <dt>
            <span id="text">
              <Translate contentKey="abacoApp.baseLineAnalitico.text">
              text
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineAnalitico.text}
          </dd>
          <dt>
            <span id="impacto">
              <Translate contentKey="abacoApp.baseLineAnalitico.impacto">
              impacto
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineAnalitico.impacto}
          </dd>
          <dt>
            <span id="tipo">
              <Translate contentKey="abacoApp.baseLineAnalitico.tipo">
              tipo
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineAnalitico.tipo}
          </dd>
          <dt>
            <span id="analiseid">
              <Translate contentKey="abacoApp.baseLineAnalitico.analiseid">
              analiseid
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineAnalitico.analiseid}
          </dd>
          <dt>
            <span id="datahomologacaosoftware">
              <Translate contentKey="abacoApp.baseLineAnalitico.datahomologacaosoftware">
              datahomologacaosoftware
              </Translate>
            </span>
          </dt>
          <dd>
            <TextFormat value={baseLineAnalitico.datahomologacaosoftware} type="date" format={APP_LOCAL_DATE_FORMAT} />
          </dd>
          <dt>
            <span id="idsistema">
              <Translate contentKey="abacoApp.baseLineAnalitico.idsistema">
              idsistema
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineAnalitico.idsistema}
          </dd>
          <dt>
            <span id="nome">
              <Translate contentKey="abacoApp.baseLineAnalitico.nome">
              nome
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineAnalitico.nome}
          </dd>
          <dt>
            <span id="sigla">
              <Translate contentKey="abacoApp.baseLineAnalitico.sigla">
              sigla
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineAnalitico.sigla}
          </dd>
          <dt>
            <span id="name">
              <Translate contentKey="abacoApp.baseLineAnalitico.name">
              name
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineAnalitico.name}
          </dd>
          <dt>
            <span id="pf">
              <Translate contentKey="abacoApp.baseLineAnalitico.pf">
              pf
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineAnalitico.pf}
          </dd>
          <dt>
            <span id="idfuncaodados">
              <Translate contentKey="abacoApp.baseLineAnalitico.idfuncaodados">
              idfuncaodados
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineAnalitico.idfuncaodados}
          </dd>
          <dt>
            <span id="complexidade">
              <Translate contentKey="abacoApp.baseLineAnalitico.complexidade">
              complexidade
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineAnalitico.complexidade}
          </dd>
          <dt>
            <span id="der">
              <Translate contentKey="abacoApp.baseLineAnalitico.der">
              der
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineAnalitico.der}
          </dd>
          <dt>
            <span id="rlralr">
              <Translate contentKey="abacoApp.baseLineAnalitico.rlralr">
              rlralr
              </Translate>
            </span>
          </dt>
          <dd>
            {baseLineAnalitico.rlralr}
          </dd>
        </dl>
        <Button tag={Link} to="/base-line-analitico" replace color="info">
          <FaArrowLeft/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.back">Back</Translate></span>
        </Button>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
    baseLineAnalitico: storeState.baseLineAnalitico.entity
});

const mapDispatchToProps = { getEntity };

export default connect(mapStateToProps, mapDispatchToProps)(BaseLineAnaliticoDetail);
