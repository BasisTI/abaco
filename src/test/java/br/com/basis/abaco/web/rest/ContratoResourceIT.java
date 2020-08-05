package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.AbacoApp;

import br.com.basis.abaco.domain.Contrato;
import br.com.basis.abaco.repository.ContratoRepository;
import br.com.basis.abaco.repository.search.ContratoSearchRepository;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ContratoResource REST controller.
 *
 * @see ContratoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class ContratoResourceIT {

    private static final String DEFAULT_NUMERO_CONTRATO = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_CONTRATO = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATA_INICIO_VIGENCIA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_INICIO_VIGENCIA = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_DATA_FIM_VIGENCIA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_FIM_VIGENCIA = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private ContratoRepository contratoRepository;

    @Autowired
    private ContratoSearchRepository contratoSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restContratoMockMvc;

    private Contrato contrato;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            ContratoResource contratoResource = new ContratoResource(contratoRepository, contratoSearchRepository);
        this.restContratoMockMvc = MockMvcBuilders.standaloneSetup(contratoResource)
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
    public static Contrato createEntity(EntityManager em) {
        Contrato contrato = new Contrato()
                .numeroContrato(DEFAULT_NUMERO_CONTRATO)
                .dataInicioVigencia(DEFAULT_DATA_INICIO_VIGENCIA)
                .dataFimVigencia(DEFAULT_DATA_FIM_VIGENCIA);
        return contrato;
    }

    @Before
    public void initTest() {
        contratoSearchRepository.deleteAll();
        contrato = createEntity(em);
    }

    @Test
    @Transactional
    public void createContrato() throws Exception {
        int databaseSizeBeforeCreate = contratoRepository.findAll().size();

        // Create the Contrato

        restContratoMockMvc.perform(post("/api/contratoes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(contrato)))
            .andExpect(status().isCreated());

        // Validate the Contrato in the database
        List<Contrato> contratoList = contratoRepository.findAll();
        assertThat(contratoList).hasSize(databaseSizeBeforeCreate + 1);
        Contrato testContrato = contratoList.get(contratoList.size() - 1);
        assertThat(testContrato.getNumeroContrato()).isEqualTo(DEFAULT_NUMERO_CONTRATO);
        assertThat(testContrato.getDataInicioVigencia()).isEqualTo(DEFAULT_DATA_INICIO_VIGENCIA);
        assertThat(testContrato.getDataFimVigencia()).isEqualTo(DEFAULT_DATA_FIM_VIGENCIA);

        // Validate the Contrato in Elasticsearch
        Contrato contratoEs = contratoSearchRepository.findOne(testContrato.getId());
        assertThat(contratoEs).isEqualToComparingFieldByField(testContrato);
    }

    @Test
    @Transactional
    public void createContratoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = contratoRepository.findAll().size();

        // Create the Contrato with an existing ID
        Contrato existingContrato = new Contrato();
        existingContrato.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restContratoMockMvc.perform(post("/api/contratoes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingContrato)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Contrato> contratoList = contratoRepository.findAll();
        assertThat(contratoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllContratoes() throws Exception {
        // Initialize the database
        contratoRepository.saveAndFlush(contrato);

        // Get all the contratoList
        restContratoMockMvc.perform(get("/api/contratoes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(contrato.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeroContrato").value(hasItem(DEFAULT_NUMERO_CONTRATO.toString())))
            .andExpect(jsonPath("$.[*].dataInicioVigencia").value(hasItem(DEFAULT_DATA_INICIO_VIGENCIA.toString())))
            .andExpect(jsonPath("$.[*].dataFimVigencia").value(hasItem(DEFAULT_DATA_FIM_VIGENCIA.toString())));
    }

    @Test
    @Transactional
    public void getContrato() throws Exception {
        // Initialize the database
        contratoRepository.saveAndFlush(contrato);

        // Get the contrato
        restContratoMockMvc.perform(get("/api/contratoes/{id}", contrato.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(contrato.getId().intValue()))
            .andExpect(jsonPath("$.numeroContrato").value(DEFAULT_NUMERO_CONTRATO.toString()))
            .andExpect(jsonPath("$.dataInicioVigencia").value(DEFAULT_DATA_INICIO_VIGENCIA.toString()))
            .andExpect(jsonPath("$.dataFimVigencia").value(DEFAULT_DATA_FIM_VIGENCIA.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingContrato() throws Exception {
        // Get the contrato
        restContratoMockMvc.perform(get("/api/contratoes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateContrato() throws Exception {
        // Initialize the database
        contratoRepository.saveAndFlush(contrato);
        contratoSearchRepository.save(contrato);
        int databaseSizeBeforeUpdate = contratoRepository.findAll().size();

        // Update the contrato
        Contrato updatedContrato = contratoRepository.findOne(contrato.getId());
        updatedContrato
                .numeroContrato(UPDATED_NUMERO_CONTRATO)
                .dataInicioVigencia(UPDATED_DATA_INICIO_VIGENCIA)
                .dataFimVigencia(UPDATED_DATA_FIM_VIGENCIA);

        restContratoMockMvc.perform(put("/api/contratoes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedContrato)))
            .andExpect(status().isOk());

        // Validate the Contrato in the database
        List<Contrato> contratoList = contratoRepository.findAll();
        assertThat(contratoList).hasSize(databaseSizeBeforeUpdate);
        Contrato testContrato = contratoList.get(contratoList.size() - 1);
        assertThat(testContrato.getNumeroContrato()).isEqualTo(UPDATED_NUMERO_CONTRATO);
        assertThat(testContrato.getDataInicioVigencia()).isEqualTo(UPDATED_DATA_INICIO_VIGENCIA);
        assertThat(testContrato.getDataFimVigencia()).isEqualTo(UPDATED_DATA_FIM_VIGENCIA);

        // Validate the Contrato in Elasticsearch
        Contrato contratoEs = contratoSearchRepository.findOne(testContrato.getId());
        assertThat(contratoEs).isEqualToComparingFieldByField(testContrato);
    }

    @Test
    @Transactional
    public void updateNonExistingContrato() throws Exception {
        int databaseSizeBeforeUpdate = contratoRepository.findAll().size();

        // Create the Contrato

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restContratoMockMvc.perform(put("/api/contratoes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(contrato)))
            .andExpect(status().isCreated());

        // Validate the Contrato in the database
        List<Contrato> contratoList = contratoRepository.findAll();
        assertThat(contratoList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteContrato() throws Exception {
        // Initialize the database
        contratoRepository.saveAndFlush(contrato);
        contratoSearchRepository.save(contrato);
        int databaseSizeBeforeDelete = contratoRepository.findAll().size();

        // Get the contrato
        restContratoMockMvc.perform(delete("/api/contratoes/{id}", contrato.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean contratoExistsInEs = contratoSearchRepository.exists(contrato.getId());
        assertThat(contratoExistsInEs).isFalse();

        // Validate the database is empty
        List<Contrato> contratoList = contratoRepository.findAll();
        assertThat(contratoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchContrato() throws Exception {
        // Initialize the database
        contratoRepository.saveAndFlush(contrato);
        contratoSearchRepository.save(contrato);

        // Search the contrato
        restContratoMockMvc.perform(get("/api/_search/contratoes?query=id:" + contrato.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(contrato.getId().intValue())))
            .andExpect(jsonPath("$.[*].numeroContrato").value(hasItem(DEFAULT_NUMERO_CONTRATO.toString())))
            .andExpect(jsonPath("$.[*].dataInicioVigencia").value(hasItem(DEFAULT_DATA_INICIO_VIGENCIA.toString())))
            .andExpect(jsonPath("$.[*].dataFimVigencia").value(hasItem(DEFAULT_DATA_FIM_VIGENCIA.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Contrato.class);
    }
}
