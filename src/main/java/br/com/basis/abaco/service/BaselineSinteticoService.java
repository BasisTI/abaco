package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.BaseLineAnaliticoFD;
import br.com.basis.abaco.domain.BaseLineAnaliticoFT;
import br.com.basis.abaco.domain.BaseLineSintetico;
import br.com.basis.abaco.repository.BaseLineAnaliticoFDRepository;
import br.com.basis.abaco.repository.BaseLineAnaliticoFTRepository;
import br.com.basis.abaco.repository.BaseLineSinteticoRepository;
import br.com.basis.abaco.repository.search.BaseLineAnaliticoFDSearchRepository;
import br.com.basis.abaco.repository.search.BaseLineAnaliticoFTSearchRepository;
import br.com.basis.abaco.repository.search.BaseLineSinteticoSearchRepository;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.List;

@Service
public class BaselineSinteticoService {

    private static final String SElECT_FUNCTION_FD = "SELECT f.row_number, f.classificacao, f.impacto , f.analise_id, f.data_homologacao_software, f.id_sistema, f.nome, f.sigla, f.name , f.pf, f.id_funcao_dados, f.complexidade, f.nome_equipe, f.equipe_responsavel_id, f.nome_funcionalidade, f.nome_modulo, f.der, f.rlr_alr, f.row_number, f.classificacao, f.impacto , f.analise_id, f.data_homologacao_software, f.id_sistema, f.nome, f.sigla, f.name, f.pf, f.id_funcao_dados, f.complexidade, f.nome_equipe, f.equipe_responsavel_id, f.nome_funcionalidade, f.nome_modulo, f.der, f.rlr_alr from fc_funcao_dados_vw( ";
    private static final String SELECT_FUNCTION_FT = "SELECT f.row_number, f.classificacao, f.impacto , f.analise_id, f.data_homologacao_software, f.id_sistema, f.nome, f.sigla, f.name , f.pf, f.id_funcao_dados, f.complexidade, f.nome_equipe, f.equipe_responsavel_id, f.nome_funcionalidade, f.nome_modulo, f.der, f.rlr_alr, f.row_number, f.classificacao, f.impacto , f.analise_id, f.data_homologacao_software, f.id_sistema, f.nome, f.sigla, f.name, f.pf, f.id_funcao_dados, f.complexidade, f.nome_equipe, f.equipe_responsavel_id, f.nome_funcionalidade, f.nome_modulo, f.der, f.rlr_alr from fc_funcao_transacao_vw( ";
    private static final String FINAL_SELECT_FUNCTION = ") f";
    private static final String MID_SELECT_FUNCTION = " , ";
    private static final String SELECT_SINTETICO = "SELECT f.row_number, f.id_sistema, f.sigla, f.nome, f.numero_ocorrencia, f.sum, f.equipe_responsavel_id, f.nome_equipe from fc_baseline_sintetico_vw( ";
    private final BaseLineSinteticoSearchRepository baseLineSinteticoSearchRepository;
    private final BaseLineSinteticoRepository baseLineSinteticoRepository;
    private final BaseLineAnaliticoFDSearchRepository baseLineAnaliticoFDSearchRepository;
    private final BaseLineAnaliticoFDRepository baseLineAnaliticoFDRepository;
    private final BaseLineAnaliticoFTSearchRepository baseLineAnaliticoFTSearchRepository;
    private final BaseLineAnaliticoFTRepository baseLineAnaliticoFTRepository;
    private final EntityManager entityManager;

    public BaselineSinteticoService(BaseLineSinteticoSearchRepository baseLineSinteticoSearchRepository,
                                     BaseLineAnaliticoFDSearchRepository baseLineAnaliticoFDSearchRepository,
                                     BaseLineAnaliticoFDRepository baseLineAnaliticoFDRepository,
                                     BaseLineAnaliticoFTSearchRepository baseLineAnaliticoFTSearchRepository,
                                     BaseLineAnaliticoFTRepository baseLineAnaliticoFTRepository,
                                     BaseLineSinteticoRepository baseLineSinteticoRepository,
                                        EntityManager entityManager) {
        this.baseLineSinteticoSearchRepository = baseLineSinteticoSearchRepository;
        this.baseLineAnaliticoFDRepository = baseLineAnaliticoFDRepository;
        this.baseLineAnaliticoFDSearchRepository = baseLineAnaliticoFDSearchRepository;
        this.baseLineSinteticoRepository = baseLineSinteticoRepository;
        this.baseLineAnaliticoFTSearchRepository = baseLineAnaliticoFTSearchRepository;
        this.baseLineAnaliticoFTRepository = baseLineAnaliticoFTRepository;
        this.entityManager = entityManager;
    }


    public BaseLineSintetico getBaseLineSintetico(Long id, Long idEquipe) {
        BaseLineSintetico baseLineSintetico = (BaseLineSintetico) entityManager.createNativeQuery(SELECT_SINTETICO + id + MID_SELECT_FUNCTION + idEquipe + FINAL_SELECT_FUNCTION, BaseLineSintetico.class).getSingleResult();
        return baseLineSintetico;
    }

    public void getBaseLineAnaliticoFDFT(Long id, Long idEquipe, BaseLineSintetico baseLineSintetico) {
        BaseLineSintetico result =  baseLineSinteticoSearchRepository.save(baseLineSintetico);
        baseLineAnaliticoFDSearchRepository.deleteAllByIdsistemaAndEquipeResponsavelId(id, idEquipe);
        baseLineAnaliticoFTSearchRepository.deleteAllByIdsistemaAndEquipeResponsavelId(id, idEquipe);
        Query nativeQueryFD = entityManager.createNativeQuery(SElECT_FUNCTION_FD + id + MID_SELECT_FUNCTION + idEquipe + FINAL_SELECT_FUNCTION, BaseLineAnaliticoFD.class);
        Query nativeQueryFT = entityManager.createNativeQuery(SELECT_FUNCTION_FT + id + MID_SELECT_FUNCTION + idEquipe + FINAL_SELECT_FUNCTION, BaseLineAnaliticoFT.class);
        List<BaseLineAnaliticoFT> lstAnaliticoFT  = nativeQueryFT.getResultList();
        List<BaseLineAnaliticoFD> lstAnaliticoFD = nativeQueryFD.getResultList();
        lstAnaliticoFD.forEach(baseLineAnaliticoFD ->  baseLineAnaliticoFDSearchRepository.save(baseLineAnaliticoFD));
        lstAnaliticoFT.forEach(baseLineAnaliticoFT ->  baseLineAnaliticoFTSearchRepository.save(baseLineAnaliticoFT));
    }
}

