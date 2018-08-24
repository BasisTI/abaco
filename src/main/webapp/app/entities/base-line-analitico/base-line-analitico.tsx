import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, InputGroup } from 'reactstrap';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
// TODO import TextFormat only when fieldContainsDate
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FaPlus, FaEye, FaPencil, FaTrash, FaSearch } from 'react-icons/lib/fa';

import {
  getSearchEntities,
  getEntities
} from './base-line-analitico.reducer';
 // tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface IBaseLineAnaliticoProps {
  getEntities: ICrudGetAction;
  getSearchEntities: ICrudGetAction;
  baseLineAnaliticos: any[];
  match: any;
}

export interface IBaseLineAnaliticoState {
  search: string;
}

export class BaseLineAnalitico extends React.Component<IBaseLineAnaliticoProps, IBaseLineAnaliticoState> {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
  }

  componentDidMount() {
    this.props.getEntities();
  }

  search = () => {
    if (this.state.search) {
      this.props.getSearchEntities(this.state.search);
    }
  }

  clear = () => {
    this.props.getEntities();
    this.setState({
      search: ''
    });
  }

  handleSearch = event => this.setState({ search: event.target.value });

  render() {
    const { baseLineAnaliticos, match } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="abacoApp.baseLineAnalitico.home.title">Base Line Analiticos</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity">
            <FaPlus /> <Translate contentKey="abacoApp.baseLineAnalitico.home.createLabel" />
          </Link>
        </h2>
        <div className="row">
          <div className="col-sm-12">
            <AvForm onSubmit={this.search}>
              <AvGroup>
                <InputGroup>
                  <AvInput type="text" name="search" value={this.state.search} onChange={this.handleSearch} placeholder={translate('abacoApp.baseLineAnalitico.home.search')} />
                  <Button className="input-group-addon">
                    <FaSearch/>
                  </Button>
                  <Button type="reset" className="input-group-addon" onClick={this.clear}>
                    <FaTrash/>
                  </Button>
                </InputGroup>
              </AvGroup>
            </AvForm>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th><Translate contentKey="global.field.id">ID</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.text">Text</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.impacto">Impacto</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.tipo">Tipo</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.analiseid">Analiseid</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.datahomologacaosoftware">Datahomologacaosoftware</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.idsistema">Idsistema</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.nome">Nome</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.sigla">Sigla</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.name">Name</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.pf">Pf</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.idfuncaodados">Idfuncaodados</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.complexidade">Complexidade</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.der">Der</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineAnalitico.rlralr">Rlralr</Translate></th>
                <th />
              </tr>
            </thead>
            <tbody>
              {
                baseLineAnaliticos.map((baseLineAnalitico, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${baseLineAnalitico.id}`} color="link" size="sm">
                      {baseLineAnalitico.id}
                    </Button>
                  </td>
                  <td>
                    {baseLineAnalitico.text}
                  </td>
                  <td>
                    {baseLineAnalitico.impacto}
                  </td>
                  <td>
                    {baseLineAnalitico.tipo}
                  </td>
                  <td>
                    {baseLineAnalitico.analiseid}
                  </td>
                  <td>
                    <TextFormat type="date" value={baseLineAnalitico.datahomologacaosoftware} format={APP_LOCAL_DATE_FORMAT} />
                  </td>
                  <td>
                    {baseLineAnalitico.idsistema}
                  </td>
                  <td>
                    {baseLineAnalitico.nome}
                  </td>
                  <td>
                    {baseLineAnalitico.sigla}
                  </td>
                  <td>
                    {baseLineAnalitico.name}
                  </td>
                  <td>
                    {baseLineAnalitico.pf}
                  </td>
                  <td>
                    {baseLineAnalitico.idfuncaodados}
                  </td>
                  <td>
                    {baseLineAnalitico.complexidade}
                  </td>
                  <td>
                    {baseLineAnalitico.der}
                  </td>
                  <td>
                    {baseLineAnalitico.rlralr}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${baseLineAnalitico.id}`} color="info" size="sm">
                        <FaEye/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.view" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${baseLineAnalitico.id}/edit`} color="primary" size="sm">
                        <FaPencil/> <span className="d-none d-md-inline"><Translate contentKey="entity.action.edit" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${baseLineAnalitico.id}/delete`} color="danger" size="sm">
                        <FaTrash/> <span className="d-none d-md-inline"><Translate contentKey="entity.action.delete" /></span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
  baseLineAnaliticos: storeState.baseLineAnalitico.entities
});

const mapDispatchToProps = { getSearchEntities, getEntities };

export default connect(mapStateToProps, mapDispatchToProps)(BaseLineAnalitico);
