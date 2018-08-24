import * as React from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Translate, ICrudGetAction, ICrudPutAction } from 'react-jhipster';
import { FaBan, FaFloppyO } from 'react-icons/lib/fa';

import { getEntity, updateEntity, createEntity } from './base-line-sintetico.reducer';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from '../../shared/util/date-utils';

export interface IBaseLineSinteticoDialogProps {
  getEntity: ICrudGetAction;
  updateEntity: ICrudPutAction;
  createEntity: ICrudPutAction;
  loading: boolean;
  updating: boolean;
  baseLineSintetico: any;
  match: any;
  history: any;
}

export interface IBaseLineSinteticoDialogState {
  showModal: boolean;
  isNew: boolean;
}

export class BaseLineSinteticoDialog extends React.Component<IBaseLineSinteticoDialogProps, IBaseLineSinteticoDialogState> {

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
    this.props.history.push('/base-line-sintetico');
  }

  render() {
    const isInvalid = false;
    const { baseLineSintetico, loading, updating } = this.props;
    const { showModal, isNew } = this.state;
    return (
      <Modal isOpen={showModal} modalTransition={{ timeout: 20 }} backdropTransition={{ timeout: 10 }}
        toggle={this.handleClose} size="lg">
      <ModalHeader toggle={this.handleClose}>
        <Translate contentKey="abacoApp.baseLineSintetico.home.createOrEditLabel">Create or edit a BaseLineSintetico</Translate>
      </ModalHeader>
      { loading ? <p>Loading...</p>
      : <AvForm model={isNew ? {} : baseLineSintetico} onSubmit={this.saveEntity} >
          <ModalBody>
            { baseLineSintetico.id ?
              <AvGroup>
                <Label for="id"><Translate contentKey="global.field.id">ID</Translate></Label>
                <AvInput type="text" className="form-control" name="id" required readOnly/>
              </AvGroup>
              : null
            }
            <AvGroup>
              <Label id="idsistemaLabel" for="idsistema">
                <Translate contentKey="abacoApp.baseLineSintetico.idsistema">
                  idsistema
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="idsistema" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="siglaLabel" for="sigla">
                <Translate contentKey="abacoApp.baseLineSintetico.sigla">
                  sigla
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="sigla" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="nomeLabel" for="nome">
                <Translate contentKey="abacoApp.baseLineSintetico.nome">
                  nome
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="nome" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="numeroocorrenciaLabel" for="numeroocorrencia">
                <Translate contentKey="abacoApp.baseLineSintetico.numeroocorrencia">
                  numeroocorrencia
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="numeroocorrencia" required />
              <AvFeedback>This field is required.</AvFeedback>
              <AvFeedback>This field cannot be longer than 50 characters.</AvFeedback>
            </AvGroup>
            <AvGroup>
              <Label id="sumLabel" for="sum">
                <Translate contentKey="abacoApp.baseLineSintetico.sum">
                  sum
                </Translate>
              </Label>
              <AvInput type="text" className="form-control" name="sum" required />
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
  baseLineSintetico: storeState.baseLineSintetico.entity,
  loading: storeState.baseLineSintetico.loading,
  updating: storeState.baseLineSintetico.updating
});

const mapDispatchToProps = { getEntity, updateEntity, createEntity };

export default connect(mapStateToProps, mapDispatchToProps)(BaseLineSinteticoDialog);
