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
} from './base-line-sintetico.reducer';
 // tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from '../../config/constants';

export interface IBaseLineSinteticoProps {
  getEntities: ICrudGetAction;
  getSearchEntities: ICrudGetAction;
  baseLineSinteticos: any[];
  match: any;
}

export interface IBaseLineSinteticoState {
  search: string;
}

export class BaseLineSintetico extends React.Component<IBaseLineSinteticoProps, IBaseLineSinteticoState> {
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
    const { baseLineSinteticos, match } = this.props;
    return (
      <div>
        <h2>
          <Translate contentKey="abacoApp.baseLineSintetico.home.title">Base Line Sinteticos</Translate>
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity">
            <FaPlus /> <Translate contentKey="abacoApp.baseLineSintetico.home.createLabel" />
          </Link>
        </h2>
        <div className="row">
          <div className="col-sm-12">
            <AvForm onSubmit={this.search}>
              <AvGroup>
                <InputGroup>
                  <AvInput type="text" name="search" value={this.state.search} onChange={this.handleSearch} placeholder={translate('abacoApp.baseLineSintetico.home.search')} />
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
                <th><Translate contentKey="abacoApp.baseLineSintetico.idsistema">Idsistema</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineSintetico.sigla">Sigla</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineSintetico.nome">Nome</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineSintetico.numeroocorrencia">Numeroocorrencia</Translate></th>
                <th><Translate contentKey="abacoApp.baseLineSintetico.sum">Sum</Translate></th>
                <th />
              </tr>
            </thead>
            <tbody>
              {
                baseLineSinteticos.map((baseLineSintetico, i) => (
                <tr key={`entity-${i}`}>
                  <td>
                    <Button tag={Link} to={`${match.url}/${baseLineSintetico.id}`} color="link" size="sm">
                      {baseLineSintetico.id}
                    </Button>
                  </td>
                  <td>
                    {baseLineSintetico.idsistema}
                  </td>
                  <td>
                    {baseLineSintetico.sigla}
                  </td>
                  <td>
                    {baseLineSintetico.nome}
                  </td>
                  <td>
                    {baseLineSintetico.numeroocorrencia}
                  </td>
                  <td>
                    {baseLineSintetico.sum}
                  </td>
                  <td className="text-right">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`${match.url}/${baseLineSintetico.id}`} color="info" size="sm">
                        <FaEye/> <span className="d-none d-md-inline" ><Translate contentKey="entity.action.view" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${baseLineSintetico.id}/edit`} color="primary" size="sm">
                        <FaPencil/> <span className="d-none d-md-inline"><Translate contentKey="entity.action.edit" /></span>
                      </Button>
                      <Button tag={Link} to={`${match.url}/${baseLineSintetico.id}/delete`} color="danger" size="sm">
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
  baseLineSinteticos: storeState.baseLineSintetico.entities
});

const mapDispatchToProps = { getSearchEntities, getEntities };

export default connect(mapStateToProps, mapDispatchToProps)(BaseLineSintetico);
