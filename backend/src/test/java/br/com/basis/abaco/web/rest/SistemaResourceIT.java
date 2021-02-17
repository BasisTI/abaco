package br.com.basis.abaco.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import javax.persistence.EntityManager;

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

import br.com.basis.abaco.AbacoApp;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.FuncaoDadosVersionavelRepository;
import br.com.basis.abaco.repository.SistemaRepository;
import br.com.basis.abaco.repository.search.SistemaSearchRepository;
import br.com.basis.abaco.service.SistemaService;
import br.com.basis.abaco.web.rest.errors.ExceptionTranslator;
import br.com.basis.dynamicexports.service.DynamicExportsService;

/**
 * Test class for the SistemaResource REST controller.
 *
 * @see SistemaResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class SistemaResourceIT {

    private static final String DEFAULT_SIGLA = "AAAAAAAAAA";
    private static final String UPDATED_SIGLA = "BBBBBBBBBB";

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_NUMERO_OCORRENCIA = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_OCORRENCIA = "BBBBBBBBBB";

    @Autowired
    private SistemaRepository sistemaRepository;

    @Autowired
    private SistemaSearchRepository sistemaSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private DynamicExportsService dynamicExportsService;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSistemaMockMvc;

    private Sistema sistema;

    @Autowired
    private FuncaoDadosVersionavelRepository funcaoDadosVersionavelRepository;

    @Autowired
    private FuncaoDadosRepository funcaoDadosRepository;

    @Autowired
    private SistemaService sistemaService;


    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        SistemaResource sistemaResource = new SistemaResource(sistemaRepository, sistemaSearchRepository,
                funcaoDadosVersionavelRepository, funcaoDadosRepository, sistemaService);
        this.restSistemaMockMvc = MockMvcBuilders.standaloneSetup(sistemaResource)
                .setCustomArgumentResolvers(pageableArgumentResolver).setControllerAdvice(exceptionTranslator)
                .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it, if
     * they test an entity which requires the current entity.
     */
    public static Sistema createEntity(EntityManager em) {
        Sistema sistema = new Sistema();
            sistema.setSigla(DEFAULT_SIGLA);
            sistema.setNome(DEFAULT_NOME);
            sistema.setNumeroOcorrencia(DEFAULT_NUMERO_OCORRENCIA);
        return sistema;
    }

    @Before
    public void initTest() {
        sistemaSearchRepository.deleteAll();
        sistema = createEntity(em);
    }

    @Test
    @Transactional
    public void createSistema() throws Exception {
        int databaseSizeBeforeCreate = sistemaRepository.findAll().size();

        // Create the Sistema

        restSistemaMockMvc.perform(post("/api/sistemas").contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(sistema))).andExpect(status().isCreated());

        // Validate the Sistema in the database
        List<Sistema> sistemaList = sistemaRepository.findAll();
        assertThat(sistemaList).hasSize(databaseSizeBeforeCreate + 1);
        Sistema testSistema = sistemaList.get(sistemaList.size() - 1);
        assertThat(testSistema.getSigla()).isEqualTo(DEFAULT_SIGLA);
        assertThat(testSistema.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testSistema.getNumeroOcorrencia()).isEqualTo(DEFAULT_NUMERO_OCORRENCIA);

        // Validate the Sistema in Elasticsearch
        Sistema sistemaEs = sistemaSearchRepository.findOne(testSistema.getId());
        assertThat(sistemaEs).isEqualToComparingFieldByField(testSistema);
    }

    @Test
    @Transactional
    public void createSistemaWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sistemaRepository.findAll().size();

        // Create the Sistema with an existing ID
        Sistema existingSistema = new Sistema();
        existingSistema.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSistemaMockMvc
                .perform(post("/api/sistemas").contentType(TestUtil.APPLICATION_JSON_UTF8)
                        .content(TestUtil.convertObjectToJsonBytes(existingSistema)))
                .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Sistema> sistemaList = sistemaRepository.findAll();
        assertThat(sistemaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = sistemaRepository.findAll().size();
        // set the field null
        sistema.setNome(null);

        // Create the Sistema, which fails.

        restSistemaMockMvc.perform(post("/api/sistemas").contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(sistema))).andExpect(status().isBadRequest());

        List<Sistema> sistemaList = sistemaRepository.findAll();
        assertThat(sistemaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSistemas() throws Exception {
        // Initialize the database
        sistemaRepository.saveAndFlush(sistema);

        // Get all the sistemaList
        restSistemaMockMvc.perform(get("/api/sistemas?sort=id,desc")).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.[*].id").value(hasItem(sistema.getId().intValue())))
                .andExpect(jsonPath("$.[*].sigla").value(hasItem(DEFAULT_SIGLA.toString())))
                .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
                .andExpect(jsonPath("$.[*].numeroOcorrencia").value(hasItem(DEFAULT_NUMERO_OCORRENCIA.toString())));
    }

    @Test
    @Transactional
    public void getSistema() throws Exception {
        // Initialize the database
        sistemaRepository.saveAndFlush(sistema);

        // Get the sistema
        restSistemaMockMvc.perform(get("/api/sistemas/{id}", sistema.getId())).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.id").value(sistema.getId().intValue()))
                .andExpect(jsonPath("$.sigla").value(DEFAULT_SIGLA.toString()))
                .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()))
                .andExpect(jsonPath("$.numeroOcorrencia").value(DEFAULT_NUMERO_OCORRENCIA.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSistema() throws Exception {
        // Get the sistema
        restSistemaMockMvc.perform(get("/api/sistemas/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSistema() throws Exception {
        // Initialize the database
        sistemaRepository.saveAndFlush(sistema);
        sistemaSearchRepository.save(sistema);
        int databaseSizeBeforeUpdate = sistemaRepository.findAll().size();

        // Update the sistema
        Sistema updatedSistema = sistemaRepository.findOne(sistema.getId());
            updatedSistema.setSigla(UPDATED_SIGLA);
            updatedSistema.setNome(UPDATED_NOME);
            updatedSistema.setNumeroOcorrencia(UPDATED_NUMERO_OCORRENCIA);
        restSistemaMockMvc.perform(put("/api/sistemas").contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedSistema))).andExpect(status().isOk());

        // Validate the Sistema in the database
        List<Sistema> sistemaList = sistemaRepository.findAll();
        assertThat(sistemaList).hasSize(databaseSizeBeforeUpdate);
        Sistema testSistema = sistemaList.get(sistemaList.size() - 1);
        assertThat(testSistema.getSigla()).isEqualTo(UPDATED_SIGLA);
        assertThat(testSistema.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testSistema.getNumeroOcorrencia()).isEqualTo(UPDATED_NUMERO_OCORRENCIA);

        // Validate the Sistema in Elasticsearch
        Sistema sistemaEs = sistemaSearchRepository.findOne(testSistema.getId());
        assertThat(sistemaEs).isEqualToComparingFieldByField(testSistema);
    }

    @Test
    @Transactional
    public void updateNonExistingSistema() throws Exception {
        int databaseSizeBeforeUpdate = sistemaRepository.findAll().size();

        // Create the Sistema

        // If the entity doesn't have an ID, it will be created instead of just being
        // updated
        restSistemaMockMvc.perform(put("/api/sistemas").contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(sistema))).andExpect(status().isCreated());

        // Validate the Sistema in the database
        List<Sistema> sistemaList = sistemaRepository.findAll();
        assertThat(sistemaList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSistema() throws Exception {
        // Initialize the database
        sistemaRepository.saveAndFlush(sistema);
        sistemaSearchRepository.save(sistema);
        int databaseSizeBeforeDelete = sistemaRepository.findAll().size();

        // Get the sistema
        restSistemaMockMvc.perform(delete("/api/sistemas/{id}", sistema.getId()).accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean sistemaExistsInEs = sistemaSearchRepository.exists(sistema.getId());
        assertThat(sistemaExistsInEs).isFalse();

        // Validate the database is empty
        List<Sistema> sistemaList = sistemaRepository.findAll();
        assertThat(sistemaList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSistema() throws Exception {
        // Initialize the database
        sistemaRepository.saveAndFlush(sistema);
        sistemaSearchRepository.save(sistema);

        // Search the sistema
        restSistemaMockMvc.perform(get("/api/_search/sistemas?query=id:" + sistema.getId())).andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(jsonPath("$.[*].id").value(hasItem(sistema.getId().intValue())))
                .andExpect(jsonPath("$.[*].sigla").value(hasItem(DEFAULT_SIGLA.toString())))
                .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
                .andExpect(jsonPath("$.[*].numeroOcorrencia").value(hasItem(DEFAULT_NUMERO_OCORRENCIA.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Sistema.class);
    }
}
