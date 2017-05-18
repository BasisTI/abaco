package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.AbacoApp;

import br.com.basis.abaco.domain.Manual;
import br.com.basis.abaco.repository.ManualRepository;
import br.com.basis.abaco.repository.search.ManualSearchRepository;
import br.com.basis.abaco.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Ignore;
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
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ManualResource REST controller.
 *
 * @see ManualResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
@Ignore
public class ManualResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_OBSERVACAO = "AAAAAAAAAA";
    private static final String UPDATED_OBSERVACAO = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_VALOR_VARIACAO_ESTIMADA = new BigDecimal(0);
    private static final BigDecimal UPDATED_VALOR_VARIACAO_ESTIMADA = new BigDecimal(1);

    private static final BigDecimal DEFAULT_VALOR_VARIACAO_INDICATIVA = new BigDecimal(0);
    private static final BigDecimal UPDATED_VALOR_VARIACAO_INDICATIVA = new BigDecimal(1);

    private static final byte[] DEFAULT_ARQUIVO_MANUAL = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_ARQUIVO_MANUAL = TestUtil.createByteArray(20000000, "1");
    private static final String DEFAULT_ARQUIVO_MANUAL_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_ARQUIVO_MANUAL_CONTENT_TYPE = "image/png";

    @Autowired
    private ManualRepository manualRepository;

    @Autowired
    private ManualSearchRepository manualSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restManualMockMvc;

    private Manual manual;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            ManualResource manualResource = new ManualResource(manualRepository, manualSearchRepository);
        this.restManualMockMvc = MockMvcBuilders.standaloneSetup(manualResource)
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
    public static Manual createEntity(EntityManager em) {
        Manual manual = new Manual()
                .nome(DEFAULT_NOME)
                .observacao(DEFAULT_OBSERVACAO)
                .valorVariacaoEstimada(DEFAULT_VALOR_VARIACAO_ESTIMADA)
                .valorVariacaoIndicativa(DEFAULT_VALOR_VARIACAO_INDICATIVA)
                .arquivoManual(DEFAULT_ARQUIVO_MANUAL)
                .arquivoManualContentType(DEFAULT_ARQUIVO_MANUAL_CONTENT_TYPE);
        return manual;
    }

    @Before
    public void initTest() {
        manualSearchRepository.deleteAll();
        manual = createEntity(em);
    }

    @Test
    @Transactional
    public void createManual() throws Exception {
        int databaseSizeBeforeCreate = manualRepository.findAll().size();

        // Create the Manual

        restManualMockMvc.perform(post("/api/manuals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(manual)))
            .andExpect(status().isCreated());

        // Validate the Manual in the database
        List<Manual> manualList = manualRepository.findAll();
        assertThat(manualList).hasSize(databaseSizeBeforeCreate + 1);
        Manual testManual = manualList.get(manualList.size() - 1);
        assertThat(testManual.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testManual.getObservacao()).isEqualTo(DEFAULT_OBSERVACAO);
        assertThat(testManual.getValorVariacaoEstimada()).isEqualTo(DEFAULT_VALOR_VARIACAO_ESTIMADA);
        assertThat(testManual.getValorVariacaoIndicativa()).isEqualTo(DEFAULT_VALOR_VARIACAO_INDICATIVA);
        assertThat(testManual.getArquivoManual()).isEqualTo(DEFAULT_ARQUIVO_MANUAL);
        assertThat(testManual.getArquivoManualContentType()).isEqualTo(DEFAULT_ARQUIVO_MANUAL_CONTENT_TYPE);

        // Validate the Manual in Elasticsearch
        Manual manualEs = manualSearchRepository.findOne(testManual.getId());
        assertThat(manualEs).isEqualToComparingFieldByField(testManual);
    }

    @Test
    @Transactional
    public void createManualWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = manualRepository.findAll().size();

        // Create the Manual with an existing ID
        Manual existingManual = new Manual();
        existingManual.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restManualMockMvc.perform(post("/api/manuals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingManual)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Manual> manualList = manualRepository.findAll();
        assertThat(manualList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkValorVariacaoEstimadaIsRequired() throws Exception {
        int databaseSizeBeforeTest = manualRepository.findAll().size();
        // set the field null
        manual.setValorVariacaoEstimada(null);

        // Create the Manual, which fails.

        restManualMockMvc.perform(post("/api/manuals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(manual)))
            .andExpect(status().isBadRequest());

        List<Manual> manualList = manualRepository.findAll();
        assertThat(manualList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkValorVariacaoIndicativaIsRequired() throws Exception {
        int databaseSizeBeforeTest = manualRepository.findAll().size();
        // set the field null
        manual.setValorVariacaoIndicativa(null);

        // Create the Manual, which fails.

        restManualMockMvc.perform(post("/api/manuals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(manual)))
            .andExpect(status().isBadRequest());

        List<Manual> manualList = manualRepository.findAll();
        assertThat(manualList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllManuals() throws Exception {
        // Initialize the database
        manualRepository.saveAndFlush(manual);

        // Get all the manualList
        restManualMockMvc.perform(get("/api/manuals?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(manual.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
            .andExpect(jsonPath("$.[*].observacao").value(hasItem(DEFAULT_OBSERVACAO.toString())))
            .andExpect(jsonPath("$.[*].valorVariacaoEstimada").value(hasItem(DEFAULT_VALOR_VARIACAO_ESTIMADA.intValue())))
            .andExpect(jsonPath("$.[*].valorVariacaoIndicativa").value(hasItem(DEFAULT_VALOR_VARIACAO_INDICATIVA.intValue())))
            .andExpect(jsonPath("$.[*].arquivoManualContentType").value(hasItem(DEFAULT_ARQUIVO_MANUAL_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].arquivoManual").value(hasItem(Base64Utils.encodeToString(DEFAULT_ARQUIVO_MANUAL))));
    }

    @Test
    @Transactional
    public void getManual() throws Exception {
        // Initialize the database
        manualRepository.saveAndFlush(manual);

        // Get the manual
        restManualMockMvc.perform(get("/api/manuals/{id}", manual.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(manual.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()))
            .andExpect(jsonPath("$.observacao").value(DEFAULT_OBSERVACAO.toString()))
            .andExpect(jsonPath("$.valorVariacaoEstimada").value(DEFAULT_VALOR_VARIACAO_ESTIMADA.intValue()))
            .andExpect(jsonPath("$.valorVariacaoIndicativa").value(DEFAULT_VALOR_VARIACAO_INDICATIVA.intValue()))
            .andExpect(jsonPath("$.arquivoManualContentType").value(DEFAULT_ARQUIVO_MANUAL_CONTENT_TYPE))
            .andExpect(jsonPath("$.arquivoManual").value(Base64Utils.encodeToString(DEFAULT_ARQUIVO_MANUAL)));
    }

    @Test
    @Transactional
    public void getNonExistingManual() throws Exception {
        // Get the manual
        restManualMockMvc.perform(get("/api/manuals/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateManual() throws Exception {
        // Initialize the database
        manualRepository.saveAndFlush(manual);
        manualSearchRepository.save(manual);
        int databaseSizeBeforeUpdate = manualRepository.findAll().size();

        // Update the manual
        Manual updatedManual = manualRepository.findOne(manual.getId());
        updatedManual
                .nome(UPDATED_NOME)
                .observacao(UPDATED_OBSERVACAO)
                .valorVariacaoEstimada(UPDATED_VALOR_VARIACAO_ESTIMADA)
                .valorVariacaoIndicativa(UPDATED_VALOR_VARIACAO_INDICATIVA)
                .arquivoManual(UPDATED_ARQUIVO_MANUAL)
                .arquivoManualContentType(UPDATED_ARQUIVO_MANUAL_CONTENT_TYPE);

        restManualMockMvc.perform(put("/api/manuals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedManual)))
            .andExpect(status().isOk());

        // Validate the Manual in the database
        List<Manual> manualList = manualRepository.findAll();
        assertThat(manualList).hasSize(databaseSizeBeforeUpdate);
        Manual testManual = manualList.get(manualList.size() - 1);
        assertThat(testManual.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testManual.getObservacao()).isEqualTo(UPDATED_OBSERVACAO);
        assertThat(testManual.getValorVariacaoEstimada()).isEqualTo(UPDATED_VALOR_VARIACAO_ESTIMADA);
        assertThat(testManual.getValorVariacaoIndicativa()).isEqualTo(UPDATED_VALOR_VARIACAO_INDICATIVA);
        assertThat(testManual.getArquivoManual()).isEqualTo(UPDATED_ARQUIVO_MANUAL);
        assertThat(testManual.getArquivoManualContentType()).isEqualTo(UPDATED_ARQUIVO_MANUAL_CONTENT_TYPE);

        // Validate the Manual in Elasticsearch
        Manual manualEs = manualSearchRepository.findOne(testManual.getId());
        assertThat(manualEs).isEqualToComparingFieldByField(testManual);
    }

    @Test
    @Transactional
    public void updateNonExistingManual() throws Exception {
        int databaseSizeBeforeUpdate = manualRepository.findAll().size();

        // Create the Manual

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restManualMockMvc.perform(put("/api/manuals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(manual)))
            .andExpect(status().isCreated());

        // Validate the Manual in the database
        List<Manual> manualList = manualRepository.findAll();
        assertThat(manualList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteManual() throws Exception {
        // Initialize the database
        manualRepository.saveAndFlush(manual);
        manualSearchRepository.save(manual);
        int databaseSizeBeforeDelete = manualRepository.findAll().size();

        // Get the manual
        restManualMockMvc.perform(delete("/api/manuals/{id}", manual.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean manualExistsInEs = manualSearchRepository.exists(manual.getId());
        assertThat(manualExistsInEs).isFalse();

        // Validate the database is empty
        List<Manual> manualList = manualRepository.findAll();
        assertThat(manualList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchManual() throws Exception {
        // Initialize the database
        manualRepository.saveAndFlush(manual);
        manualSearchRepository.save(manual);

        // Search the manual
        restManualMockMvc.perform(get("/api/_search/manuals?query=id:" + manual.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(manual.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
            .andExpect(jsonPath("$.[*].observacao").value(hasItem(DEFAULT_OBSERVACAO.toString())))
            .andExpect(jsonPath("$.[*].valorVariacaoEstimada").value(hasItem(DEFAULT_VALOR_VARIACAO_ESTIMADA.intValue())))
            .andExpect(jsonPath("$.[*].valorVariacaoIndicativa").value(hasItem(DEFAULT_VALOR_VARIACAO_INDICATIVA.intValue())))
            .andExpect(jsonPath("$.[*].arquivoManualContentType").value(hasItem(DEFAULT_ARQUIVO_MANUAL_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].arquivoManual").value(hasItem(Base64Utils.encodeToString(DEFAULT_ARQUIVO_MANUAL))));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Manual.class);
    }
}
