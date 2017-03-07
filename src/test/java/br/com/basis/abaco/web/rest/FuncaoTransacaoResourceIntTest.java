package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.AbacoApp;

import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.search.FuncaoTransacaoSearchRepository;
import br.com.basis.abaco.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.basis.abaco.domain.enumeration.TipoFuncaoTransacao;
import br.com.basis.abaco.domain.enumeration.Complexidade;
/**
 * Test class for the FuncaoTransacaoResource REST controller.
 *
 * @see FuncaoTransacaoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class FuncaoTransacaoResourceIntTest {

    private static final TipoFuncaoTransacao DEFAULT_TIPO = TipoFuncaoTransacao.EE;
    private static final TipoFuncaoTransacao UPDATED_TIPO = TipoFuncaoTransacao.SE;

    private static final Complexidade DEFAULT_COMPLEXIDADE = Complexidade.BAIXA;
    private static final Complexidade UPDATED_COMPLEXIDADE = Complexidade.MEDIA;

    private static final BigDecimal DEFAULT_PF = new BigDecimal(1);
    private static final BigDecimal UPDATED_PF = new BigDecimal(2);

    @Autowired
    private FuncaoTransacaoRepository funcaoTransacaoRepository;

    @Autowired
    private FuncaoTransacaoSearchRepository funcaoTransacaoSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restFuncaoTransacaoMockMvc;

    private FuncaoTransacao funcaoTransacao;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            FuncaoTransacaoResource funcaoTransacaoResource = new FuncaoTransacaoResource(funcaoTransacaoRepository, funcaoTransacaoSearchRepository);
        this.restFuncaoTransacaoMockMvc = MockMvcBuilders.standaloneSetup(funcaoTransacaoResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FuncaoTransacao createEntity(EntityManager em) {
        FuncaoTransacao funcaoTransacao = new FuncaoTransacao()
                .tipo(DEFAULT_TIPO)
                .complexidade(DEFAULT_COMPLEXIDADE)
                .pf(DEFAULT_PF);
        return funcaoTransacao;
    }

    @Before
    public void initTest() {
        funcaoTransacaoSearchRepository.deleteAll();
        funcaoTransacao = createEntity(em);
    }

    @Test
    @Transactional
    public void createFuncaoTransacao() throws Exception {
        int databaseSizeBeforeCreate = funcaoTransacaoRepository.findAll().size();

        // Create the FuncaoTransacao

        restFuncaoTransacaoMockMvc.perform(post("/api/funcao-transacaos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(funcaoTransacao)))
            .andExpect(status().isCreated());

        // Validate the FuncaoTransacao in the database
        List<FuncaoTransacao> funcaoTransacaoList = funcaoTransacaoRepository.findAll();
        assertThat(funcaoTransacaoList).hasSize(databaseSizeBeforeCreate + 1);
        FuncaoTransacao testFuncaoTransacao = funcaoTransacaoList.get(funcaoTransacaoList.size() - 1);
        assertThat(testFuncaoTransacao.getTipo()).isEqualTo(DEFAULT_TIPO);
        assertThat(testFuncaoTransacao.getComplexidade()).isEqualTo(DEFAULT_COMPLEXIDADE);
        assertThat(testFuncaoTransacao.getPf()).isEqualTo(DEFAULT_PF);

        // Validate the FuncaoTransacao in Elasticsearch
        FuncaoTransacao funcaoTransacaoEs = funcaoTransacaoSearchRepository.findOne(testFuncaoTransacao.getId());
        assertThat(funcaoTransacaoEs).isEqualToComparingFieldByField(testFuncaoTransacao);
    }

    @Test
    @Transactional
    public void createFuncaoTransacaoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = funcaoTransacaoRepository.findAll().size();

        // Create the FuncaoTransacao with an existing ID
        FuncaoTransacao existingFuncaoTransacao = new FuncaoTransacao();
        existingFuncaoTransacao.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFuncaoTransacaoMockMvc.perform(post("/api/funcao-transacaos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingFuncaoTransacao)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<FuncaoTransacao> funcaoTransacaoList = funcaoTransacaoRepository.findAll();
        assertThat(funcaoTransacaoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllFuncaoTransacaos() throws Exception {
        // Initialize the database
        funcaoTransacaoRepository.saveAndFlush(funcaoTransacao);

        // Get all the funcaoTransacaoList
        restFuncaoTransacaoMockMvc.perform(get("/api/funcao-transacaos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(funcaoTransacao.getId().intValue())))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO.toString())))
            .andExpect(jsonPath("$.[*].complexidade").value(hasItem(DEFAULT_COMPLEXIDADE.toString())))
            .andExpect(jsonPath("$.[*].pf").value(hasItem(DEFAULT_PF.intValue())));
    }

    @Test
    @Transactional
    public void getFuncaoTransacao() throws Exception {
        // Initialize the database
        funcaoTransacaoRepository.saveAndFlush(funcaoTransacao);

        // Get the funcaoTransacao
        restFuncaoTransacaoMockMvc.perform(get("/api/funcao-transacaos/{id}", funcaoTransacao.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(funcaoTransacao.getId().intValue()))
            .andExpect(jsonPath("$.tipo").value(DEFAULT_TIPO.toString()))
            .andExpect(jsonPath("$.complexidade").value(DEFAULT_COMPLEXIDADE.toString()))
            .andExpect(jsonPath("$.pf").value(DEFAULT_PF.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingFuncaoTransacao() throws Exception {
        // Get the funcaoTransacao
        restFuncaoTransacaoMockMvc.perform(get("/api/funcao-transacaos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFuncaoTransacao() throws Exception {
        // Initialize the database
        funcaoTransacaoRepository.saveAndFlush(funcaoTransacao);
        funcaoTransacaoSearchRepository.save(funcaoTransacao);
        int databaseSizeBeforeUpdate = funcaoTransacaoRepository.findAll().size();

        // Update the funcaoTransacao
        FuncaoTransacao updatedFuncaoTransacao = funcaoTransacaoRepository.findOne(funcaoTransacao.getId());
        updatedFuncaoTransacao
                .tipo(UPDATED_TIPO)
                .complexidade(UPDATED_COMPLEXIDADE)
                .pf(UPDATED_PF);

        restFuncaoTransacaoMockMvc.perform(put("/api/funcao-transacaos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFuncaoTransacao)))
            .andExpect(status().isOk());

        // Validate the FuncaoTransacao in the database
        List<FuncaoTransacao> funcaoTransacaoList = funcaoTransacaoRepository.findAll();
        assertThat(funcaoTransacaoList).hasSize(databaseSizeBeforeUpdate);
        FuncaoTransacao testFuncaoTransacao = funcaoTransacaoList.get(funcaoTransacaoList.size() - 1);
        assertThat(testFuncaoTransacao.getTipo()).isEqualTo(UPDATED_TIPO);
        assertThat(testFuncaoTransacao.getComplexidade()).isEqualTo(UPDATED_COMPLEXIDADE);
        assertThat(testFuncaoTransacao.getPf()).isEqualTo(UPDATED_PF);

        // Validate the FuncaoTransacao in Elasticsearch
        FuncaoTransacao funcaoTransacaoEs = funcaoTransacaoSearchRepository.findOne(testFuncaoTransacao.getId());
        assertThat(funcaoTransacaoEs).isEqualToComparingFieldByField(testFuncaoTransacao);
    }

    @Test
    @Transactional
    public void updateNonExistingFuncaoTransacao() throws Exception {
        int databaseSizeBeforeUpdate = funcaoTransacaoRepository.findAll().size();

        // Create the FuncaoTransacao

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restFuncaoTransacaoMockMvc.perform(put("/api/funcao-transacaos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(funcaoTransacao)))
            .andExpect(status().isCreated());

        // Validate the FuncaoTransacao in the database
        List<FuncaoTransacao> funcaoTransacaoList = funcaoTransacaoRepository.findAll();
        assertThat(funcaoTransacaoList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteFuncaoTransacao() throws Exception {
        // Initialize the database
        funcaoTransacaoRepository.saveAndFlush(funcaoTransacao);
        funcaoTransacaoSearchRepository.save(funcaoTransacao);
        int databaseSizeBeforeDelete = funcaoTransacaoRepository.findAll().size();

        // Get the funcaoTransacao
        restFuncaoTransacaoMockMvc.perform(delete("/api/funcao-transacaos/{id}", funcaoTransacao.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean funcaoTransacaoExistsInEs = funcaoTransacaoSearchRepository.exists(funcaoTransacao.getId());
        assertThat(funcaoTransacaoExistsInEs).isFalse();

        // Validate the database is empty
        List<FuncaoTransacao> funcaoTransacaoList = funcaoTransacaoRepository.findAll();
        assertThat(funcaoTransacaoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchFuncaoTransacao() throws Exception {
        // Initialize the database
        funcaoTransacaoRepository.saveAndFlush(funcaoTransacao);
        funcaoTransacaoSearchRepository.save(funcaoTransacao);

        // Search the funcaoTransacao
        restFuncaoTransacaoMockMvc.perform(get("/api/_search/funcao-transacaos?query=id:" + funcaoTransacao.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(funcaoTransacao.getId().intValue())))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO.toString())))
            .andExpect(jsonPath("$.[*].complexidade").value(hasItem(DEFAULT_COMPLEXIDADE.toString())))
            .andExpect(jsonPath("$.[*].pf").value(hasItem(DEFAULT_PF.intValue())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FuncaoTransacao.class);
    }
}
