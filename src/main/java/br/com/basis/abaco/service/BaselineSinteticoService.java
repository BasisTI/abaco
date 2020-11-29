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

    private static final String SELECT_FUNCTION_FD = "SELECT f.row_number, f.classificacao, f.impacto , f.analise_id, f.data_homologacao_software, f.id_sistema, f.nome, f.sigla, f.name , f.pf, f.id_funcao_dados, f.complexidade, f.nome_equipe, f.equipe_responsavel_id, f.nome_funcionalidade, f.nome_modulo, f.der, f.rlr_alr, f.row_number, f.classificacao, f.impacto , f.analise_id, f.data_homologacao_software, f.id_sistema, f.nome, f.sigla, f.name, f.pf, f.id_funcao_dados, f.complexidade, f.nome_equipe, f.equipe_responsavel_id, f.nome_funcionalidade, f.nome_modulo, f.der, f.rlr_alr from fc_funcao_dados_vw( :id , :idEquipe ) f;";
    private static final String SELECT_FUNCTION_FT = "SELECT f.row_number, f.classificacao, f.impacto , f.analise_id, f.data_homologacao_software, f.id_sistema, f.nome, f.sigla, f.name , f.pf, f.id_funcao_dados, f.complexidade, f.nome_equipe, f.equipe_responsavel_id, f.nome_funcionalidade, f.nome_modulo, f.der, f.rlr_alr, f.row_number, f.classificacao, f.impacto , f.analise_id, f.data_homologacao_software, f.id_sistema, f.nome, f.sigla, f.name, f.pf, f.id_funcao_dados, f.complexidade, f.nome_equipe, f.equipe_responsavel_id, f.nome_funcionalidade, f.nome_modulo, f.der, f.rlr_alr from fc_funcao_transacao_vw( :id , :idEquipe ) f; ";
    private static final String SELECT_SINTETICO = "SELECT f.row_number, f.id_sistema, f.sigla, f.nome, f.numero_ocorrencia, f.sum, f.equipe_responsavel_id, f.nome_equipe from fc_baseline_sintetico_vw( :id , :idEquipe ) f;";
    private final BaseLineSinteticoSearchRepository baseLineSinteticoSearchRepository;
    private final BaseLineAnaliticoFDSearchRepository baseLineAnaliticoFDSearchRepository;
    private final BaseLineAnaliticoFTSearchRepository baseLineAnaliticoFTSearchRepository;
    private final EntityManager entityManager;

    public BaselineSinteticoService(BaseLineSinteticoSearchRepository baseLineSinteticoSearchRepository,
                                    BaseLineAnaliticoFDSearchRepository baseLineAnaliticoFDSearchRepository,
                                    BaseLineAnaliticoFDRepository baseLineAnaliticoFDRepository,
                                    BaseLineAnaliticoFTSearchRepository baseLineAnaliticoFTSearchRepository,
                                    BaseLineAnaliticoFTRepository baseLineAnaliticoFTRepository,
                                    BaseLineSinteticoRepository baseLineSinteticoRepository,
                                    EntityManager entityManager) {
        this.baseLineSinteticoSearchRepository = baseLineSinteticoSearchRepository;
        this.baseLineAnaliticoFDSearchRepository = baseLineAnaliticoFDSearchRepository;
        this.baseLineAnaliticoFTSearchRepository = baseLineAnaliticoFTSearchRepository;
        this.entityManager = entityManager;
    }


    public BaseLineSintetico getBaseLineSintetico(Long id, Long idEquipe) {
        Query query = entityManager.createNativeQuery(SELECT_SINTETICO, BaseLineSintetico.class).setParameter("id", id).setParameter("idEquipe", idEquipe);
        BaseLineSintetico baseLineSintetico = (BaseLineSintetico) query.getSingleResult();
        return baseLineSintetico;
    }

    public BaseLineSintetico getBaseLineAnaliticoFDFT(Long id, Long idEquipe, BaseLineSintetico baseLineSintetico) {
        BaseLineSintetico result = baseLineSinteticoSearchRepository.save(baseLineSintetico);
        baseLineAnaliticoFDSearchRepository.deleteAllByIdsistemaAndEquipeResponsavelId(id, idEquipe);
        baseLineAnaliticoFTSearchRepository.deleteAllByIdsistemaAndEquipeResponsavelId(id, idEquipe);
        Query nativeQueryFD = entityManager.createNativeQuery(SELECT_FUNCTION_FD, BaseLineAnaliticoFD.class).setParameter("id", id).setParameter("idEquipe", idEquipe);
        Query nativeQueryFT = entityManager.createNativeQuery(SELECT_FUNCTION_FT, BaseLineAnaliticoFT.class).setParameter("id", id).setParameter("idEquipe", idEquipe);
        List<BaseLineAnaliticoFT> lstAnaliticoFT = nativeQueryFT.getResultList();
        List<BaseLineAnaliticoFD> lstAnaliticoFD = nativeQueryFD.getResultList();
        lstAnaliticoFD.forEach(baseLineAnaliticoFD -> baseLineAnaliticoFDSearchRepository.save(baseLineAnaliticoFD));
        lstAnaliticoFT.forEach(baseLineAnaliticoFT -> baseLineAnaliticoFTSearchRepository.save(baseLineAnaliticoFT));
        return result;
    }
}

