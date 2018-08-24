import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Translate, ICrudGetAction, ICrudPutAction } from 'react-jhipster';
import { FaBan, FaFloppyO } from 'react-icons/lib/fa';

import { getEntity, updateEntity, createEntity } from './base-line-analitico.reducer';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from '../../shared/util/date-utils';

export interface IBaseLineAnaliticoDialogProps {
  getEntity: ICrudGetAction;
  updateEntity: ICrudPutAction;
  createEntity: ICrudPutAction;
  loading: boolean;
  updating: boolean;
  baseLineAnalitico: any;
  match: any;
  history: any;
}

export interface IBaseLineAnaliticoDialogState {
  showModal: boolean;
  isNew: boolean;
}

export class BaseLineAnaliticoDialog extends React.Component<IBaseLineAnaliticoDialogProps, IBaseLineAnaliticoDialogState> {

  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id,
      showModal: true
    };
  }

  componentDidMount() {
    !this.state.isNew && this.props.getEntity(this.props.match.params.id);
  }

  saveEntity = (event, errors, values) => {
    if (this.state.isNew) {
      this.props.createEntity(values);
    } else {
      this.props.updateEntity(values);
    }
    this.handleClose();
  }

  handleClose = () => {
    this.setState({
        showModal: false
    });
    this.props.history.push('/base-line-analitico');
  }

  render() {
    const isInvalid = false;
    const { baseLineAnalitico, loading, updating } = this.props;
    const { showModal, isNew } = this.state;
    return (
      <Modal isOpen={showModal} modalTransition={{ timeout: 20 }} backdropTransition={{ timeout: 10 }}
        toggle={this.handleClose} size="lg">
      <ModalHeader toggle={this.handleClose}>
        <Translate contentKey="abacoApp.baseLineAnalitico.home.createOrEditLabel">Create or edit a BaseLineAnalitico</Translate>
      </ModalHeader>
      { loading ? <p>Loading...</p>
      : <AvForm model={isNew ? {} : baseLineAnalitico} onSubmit={this.saveEntity} >
          <ModalBody>
            { baseLineAnalitico.id ?
              <AvGroup>
                <Label for="id"><Translate contentKey="global.field.id">ID</Translate></Label>
                <AvInput type="text" className="form-control" name="id" required readOnly/>
              </AvGroup>
              : null
            }
            <AvGroup>
              <Label id="textLabel" for="text">
                <Translate contentKey="abacoApp.baseLineAnalitico.text">
                  text
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="text" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="impactoLabel" for="impacto">
                <Translate contentKey="abacoApp.baseLineAnalitico.impacto">
                  impacto
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="impacto" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="tipoLabel" for="tipo">
                <Translate contentKey="abacoApp.baseLineAnalitico.tipo">
                  tipo
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="tipo" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="analiseidLabel" for="analiseid">
                <Translate contentKey="abacoApp.baseLineAnalitico.analiseid">
                  analiseid
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="analiseid" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="datahomologacaosoftwareLabel" for="datahomologacaosoftware">
                <Translate contentKey="abacoApp.baseLineAnalitico.datahomologacaosoftware">
                  datahomologacaosoftware
                </Translate>
              </Label>
              <AvInput type="date" className="form-control" name="datahomologacaosoftware" required />
              <AvFeedback>This field is required.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="idsistemaLabel" for="idsistema">
                <Translate contentKey="abacoApp.baseLineAnalitico.idsistema">
                  idsistema
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="idsistema" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="nomeLabel" for="nome">
                <Translate contentKey="abacoApp.baseLineAnalitico.nome">
                  nome
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="nome" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="siglaLabel" for="sigla">
                <Translate contentKey="abacoApp.baseLineAnalitico.sigla">
                  sigla
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="sigla" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="nameLabel" for="name">
                <Translate contentKey="abacoApp.baseLineAnalitico.name">
                  name
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="name" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="pfLabel" for="pf">
                <Translate contentKey="abacoApp.baseLineAnalitico.pf">
                  pf
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="pf" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="idfuncaodadosLabel" for="idfuncaodados">
                <Translate contentKey="abacoApp.baseLineAnalitico.idfuncaodados">
                  idfuncaodados
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="idfuncaodados" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="complexidadeLabel" for="complexidade">
                <Translate contentKey="abacoApp.baseLineAnalitico.complexidade">
                  complexidade
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="complexidade" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="derLabel" for="der">
                <Translate contentKey="abacoApp.baseLineAnalitico.der">
                  der
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="der" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="rlralrLabel" for="rlralr">
                <Translate contentKey="abacoApp.baseLineAnalitico.rlralr">
                  rlralr
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="rlralr" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleClose}>
              <FaBan/>&nbsp;
              <Translate contentKey="entity.action.cancel">Cancel</Translate>
            </Button>
            <Button color="primary" type="submit" disabled={isInvalid || updating}>
              <FaFloppyO/>&nbsp;
              <Translate contentKey="entity.action.save">Save</Translate>
            </Button>
          </ModalFooter>
        </AvForm>
      }
    </Modal>
    );
  }
}

const mapStateToProps = storeState => ({
  baseLineAnalitico: storeState.baseLineAnalitico.entity,
  loading: storeState.baseLineAnalitico.loading,
  updating: storeState.baseLineAnalitico.updating
});

const mapDispatchToProps = { getEntity, updateEntity, createEntity };

export default connect(mapStateToProps, mapDispatchToProps)(BaseLineAnaliticoDialog);
