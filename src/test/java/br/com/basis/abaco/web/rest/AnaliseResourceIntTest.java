package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.AbacoApp;

import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
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

import br.com.basis.abaco.domain.enumeration.MetodoContagem;
import br.com.basis.abaco.domain.enumeration.TipoAnalise;
/**
 * Test class for the AnaliseResource REST controller.
 *
 * @see AnaliseResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class AnaliseResourceIntTest {

    private static final String DEFAULT_NUMERO_OS = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_OS = "BBBBBBBBBB";

    private static final MetodoContagem DEFAULT_TIPO_CONTAGEM = MetodoContagem.DETALHADA;
    private static final MetodoContagem UPDATED_TIPO_CONTAGEM = MetodoContagem.INDICATIVA;

    private static final BigDecimal DEFAULT_VALOR_AJUSTE = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALOR_AJUSTE = new BigDecimal(2);

    private static final String DEFAULT_PF_TOTAL = "AAAAAAAAAA";
    private static final String UPDATED_PF_TOTAL = "BBBBBBBBBB";

    private static final String DEFAULT_ESCOPO = "AAAAAAAAAA";
    private static final String UPDATED_ESCOPO = "BBBBBBBBBB";

    private static final String DEFAULT_FRONTEIRAS = "AAAAAAAAAA";
    private static final String UPDATED_FRONTEIRAS = "BBBBBBBBBB";

    private static final String DEFAULT_DOCUMENTACAO = "AAAAAAAAAA";
    private static final String UPDATED_DOCUMENTACAO = "BBBBBBBBBB";

    private static final TipoAnalise DEFAULT_TIPO_ANALISE = TipoAnalise.DESENVOLVIMENTO;
    private static final TipoAnalise UPDATED_TIPO_ANALISE = TipoAnalise.MELHORIA;

    private static final String DEFAULT_PROPOSITO_CONTAGEM = "AAAAAAAAAA";
    private static final String UPDATED_PROPOSITO_CONTAGEM = "BBBBBBBBBB";

    @Autowired
    private AnaliseRepository analiseRepository;

    @Autowired
    private AnaliseSearchRepository analiseSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restAnaliseMockMvc;

    private Analise analise;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            AnaliseResource analiseResource = new AnaliseResource(analiseRepository, analiseSearchRepository);
        this.restAnaliseMockMvc = MockMvcBuilders.standaloneSetup(analiseResource)
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
    public static Analise createEntity(EntityManager em) {
        Analise analise = new Analise()
                .numeroOs(DEFAULT_NUMERO_OS)
                .tipoContagem(DEFAULT_TIPO_CONTAGEM)
                .valorAjuste(DEFAULT_VALOR_AJUSTE)
                .pfTotal(DEFAULT_PF_TOTAL)
                .escopo(DEFAULT_ESCOPO)
                .fronteiras(DEFAULT_FRONTEIRAS)
                .documentacao(DEFAULT_DOCUMENTACAO)
                .tipoAnalise(DEFAULT_TIPO_ANALISE)
                .propositoContagem(DEFAULT_PROPOSITO_CONTAGEM);
        return analise;
    }

    @Before
    public void initTest() {
        analiseSearchRepository.deleteAll();
        analise = createEntity(em);
    }

    @Test
    @Transactional
    public void createAnalise() throws Exception {
        int databaseSizeBeforeCreate = analiseRepository.findAll().size();

        // Create the Analise

        restAnaliseMockMvc.perform(post("/api/analises")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(analise)))
            .andExpect(status().isCreated());

        // Validate the Analise in the database
        List<Analise> analiseList = analiseRepository.findAll();
        assertThat(analiseList).hasSize(databaseSizeBeforeCreate + 1);
        Analise testAnalise = analiseList.get(analiseList.size() - 1);
        assertThat(testAnalise.getNumeroOs()).isEqualTo(DEFAULT_NUMERO_OS);
        assertThat(testAnalise.getTipoContagem()).isEqualTo(DEFAULT_TIPO_CONTAGEM);
        assertThat(testAnalise.getValorAjuste()).isEqualTo(DEFAULT_VALOR_AJUSTE);
        assertThat(testAnalise.getPfTotal()).isEqualTo(DEFAULT_PF_TOTAL);
        assertThat(testAnalise.getEscopo()).isEqualTo(DEFAULT_ESCOPO);
        assertThat(testAnalise.getFronteiras()).isEqualTo(DEFAULT_FRONTEIRAS);
        assertThat(testAnalise.getDocumentacao()).isEqualTo(DEFAULT_DOCUMENTACAO);
        assertThat(testAnalise.getTipoAnalise()).isEqualTo(DEFAULT_TIPO_ANALISE);
        assertThat(testAnalise.getPropositoContagem()).isEqualTo(DEFAULT_PROPOSITO_CONTAGEM);

        // Validate the Analise in Elasticsearch
        Analise analiseEs = analiseSearchRepository.findOne(testAnalise.getId());
        assertThat(analiseEs).isEqualToComparingFieldByField(testAnalise);
    }

    @Test
    @Transactional
    public void createAnaliseWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = analiseRepository.findAll().size();

        // Create the Analise with an existing ID
        Analise existingAnalise = new Analise();
        existingAnalise.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAnaliseMockMvc.perform(post("/api/analises")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingAnalise)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Analise> analiseList = analiseRepository.findAll();
        assertThat(analiseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllAnalises() throws Exception {
        // Initialize the database
        analiseRepository.saveAndFlush(analise);

        // Get all the analiseList
        restAnaliseMockMvc.perform(get("/api/analises?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(analise.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeroOs").value(hasItem(DEFAULT_NUMERO_OS.toString())))
            .andExpect(jsonPath("$.[*].tipoContagem").value(hasItem(DEFAULT_TIPO_CONTAGEM.toString())))
            .andExpect(jsonPath("$.[*].valorAjuste").value(hasItem(DEFAULT_VALOR_AJUSTE.intValue())))
            .andExpect(jsonPath("$.[*].pfTotal").value(hasItem(DEFAULT_PF_TOTAL.toString())))
            .andExpect(jsonPath("$.[*].escopo").value(hasItem(DEFAULT_ESCOPO.toString())))
            .andExpect(jsonPath("$.[*].fronteiras").value(hasItem(DEFAULT_FRONTEIRAS.toString())))
            .andExpect(jsonPath("$.[*].documentacao").value(hasItem(DEFAULT_DOCUMENTACAO.toString())))
            .andExpect(jsonPath("$.[*].tipoAnalise").value(hasItem(DEFAULT_TIPO_ANALISE.toString())))
            .andExpect(jsonPath("$.[*].propositoContagem").value(hasItem(DEFAULT_PROPOSITO_CONTAGEM.toString())));
    }

    @Test
    @Transactional
    public void getAnalise() throws Exception {
        // Initialize the database
        analiseRepository.saveAndFlush(analise);

        // Get the analise
        restAnaliseMockMvc.perform(get("/api/analises/{id}", analise.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(analise.getId().intValue()))
            .andExpect(jsonPath("$.numeroOs").value(DEFAULT_NUMERO_OS.toString()))
            .andExpect(jsonPath("$.tipoContagem").value(DEFAULT_TIPO_CONTAGEM.toString()))
            .andExpect(jsonPath("$.valorAjuste").value(DEFAULT_VALOR_AJUSTE.intValue()))
            .andExpect(jsonPath("$.pfTotal").value(DEFAULT_PF_TOTAL.toString()))
            .andExpect(jsonPath("$.escopo").value(DEFAULT_ESCOPO.toString()))
            .andExpect(jsonPath("$.fronteiras").value(DEFAULT_FRONTEIRAS.toString()))
            .andExpect(jsonPath("$.documentacao").value(DEFAULT_DOCUMENTACAO.toString()))
            .andExpect(jsonPath("$.tipoAnalise").value(DEFAULT_TIPO_ANALISE.toString()))
            .andExpect(jsonPath("$.propositoContagem").value(DEFAULT_PROPOSITO_CONTAGEM.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingAnalise() throws Exception {
        // Get the analise
        restAnaliseMockMvc.perform(get("/api/analises/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAnalise() throws Exception {
        // Initialize the database
        analiseRepository.saveAndFlush(analise);
        analiseSearchRepository.save(analise);
        int databaseSizeBeforeUpdate = analiseRepository.findAll().size();

        // Update the analise
        Analise updatedAnalise = analiseRepository.findOne(analise.getId());
        updatedAnalise
                .numeroOs(UPDATED_NUMERO_OS)
                .tipoContagem(UPDATED_TIPO_CONTAGEM)
                .valorAjuste(UPDATED_VALOR_AJUSTE)
                .pfTotal(UPDATED_PF_TOTAL)
                .escopo(UPDATED_ESCOPO)
                .fronteiras(UPDATED_FRONTEIRAS)
                .documentacao(UPDATED_DOCUMENTACAO)
                .tipoAnalise(UPDATED_TIPO_ANALISE)
                .propositoContagem(UPDATED_PROPOSITO_CONTAGEM);

        restAnaliseMockMvc.perform(put("/api/analises")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAnalise)))
            .andExpect(status().isOk());

        // Validate the Analise in the database
        List<Analise> analiseList = analiseRepository.findAll();
        assertThat(analiseList).hasSize(databaseSizeBeforeUpdate);
        Analise testAnalise = analiseList.get(analiseList.size() - 1);
        assertThat(testAnalise.getNumeroOs()).isEqualTo(UPDATED_NUMERO_OS);
        assertThat(testAnalise.getTipoContagem()).isEqualTo(UPDATED_TIPO_CONTAGEM);
        assertThat(testAnalise.getValorAjuste()).isEqualTo(UPDATED_VALOR_AJUSTE);
        assertThat(testAnalise.getPfTotal()).isEqualTo(UPDATED_PF_TOTAL);
        assertThat(testAnalise.getEscopo()).isEqualTo(UPDATED_ESCOPO);
        assertThat(testAnalise.getFronteiras()).isEqualTo(UPDATED_FRONTEIRAS);
        assertThat(testAnalise.getDocumentacao()).isEqualTo(UPDATED_DOCUMENTACAO);
        assertThat(testAnalise.getTipoAnalise()).isEqualTo(UPDATED_TIPO_ANALISE);
        assertThat(testAnalise.getPropositoContagem()).isEqualTo(UPDATED_PROPOSITO_CONTAGEM);

        // Validate the Analise in Elasticsearch
        Analise analiseEs = analiseSearchRepository.findOne(testAnalise.getId());
        assertThat(analiseEs).isEqualToComparingFieldByField(testAnalise);
    }

    @Test
    @Transactional
    public void updateNonExistingAnalise() throws Exception {
        int databaseSizeBeforeUpdate = analiseRepository.findAll().size();

        // Create the Analise

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAnaliseMockMvc.perform(put("/api/analises")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(analise)))
            .andExpect(status().isCreated());

        // Validate the Analise in the database
        List<Analise> analiseList = analiseRepository.findAll();
        assertThat(analiseList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteAnalise() throws Exception {
        // Initialize the database
        analiseRepository.saveAndFlush(analise);
        analiseSearchRepository.save(analise);
        int databaseSizeBeforeDelete = analiseRepository.findAll().size();

        // Get the analise
        restAnaliseMockMvc.perform(delete("/api/analises/{id}", analise.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean analiseExistsInEs = analiseSearchRepository.exists(analise.getId());
        assertThat(analiseExistsInEs).isFalse();

        // Validate the database is empty
        List<Analise> analiseList = analiseRepository.findAll();
        assertThat(analiseList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchAnalise() throws Exception {
        // Initialize the database
        analiseRepository.saveAndFlush(analise);
        analiseSearchRepository.save(analise);

        // Search the analise
        restAnaliseMockMvc.perform(get("/api/_search/analises?query=id:" + analise.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(analise.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeroOs").value(hasItem(DEFAULT_NUMERO_OS.toString())))
            .andExpect(jsonPath("$.[*].tipoContagem").value(hasItem(DEFAULT_TIPO_CONTAGEM.toString())))
            .andExpect(jsonPath("$.[*].valorAjuste").value(hasItem(DEFAULT_VALOR_AJUSTE.intValue())))
            .andExpect(jsonPath("$.[*].pfTotal").value(hasItem(DEFAULT_PF_TOTAL.toString())))
            .andExpect(jsonPath("$.[*].escopo").value(hasItem(DEFAULT_ESCOPO.toString())))
            .andExpect(jsonPath("$.[*].fronteiras").value(hasItem(DEFAULT_FRONTEIRAS.toString())))
            .andExpect(jsonPath("$.[*].documentacao").value(hasItem(DEFAULT_DOCUMENTACAO.toString())))
            .andExpect(jsonPath("$.[*].tipoAnalise").value(hasItem(DEFAULT_TIPO_ANALISE.toString())))
            .andExpect(jsonPath("$.[*].propositoContagem").value(hasItem(DEFAULT_PROPOSITO_CONTAGEM.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Analise.class);
    }
}
