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

import java.math.BigDecimal;
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
import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.repository.EsforcoFaseRepository;
import br.com.basis.abaco.repository.search.EsforcoFaseSearchRepository;
import br.com.basis.abaco.web.rest.errors.ExceptionTranslator;

/**
 * Test class for the EsforcoFaseResource REST controller.
 *
 * @see EsforcoFaseResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class EsforcoFaseResourceIT {

    private static final BigDecimal DEFAULT_ESFORCO = new BigDecimal(1);
    private static final BigDecimal UPDATED_ESFORCO = new BigDecimal(2);

    @Autowired
    private EsforcoFaseRepository esforcoFaseRepository;

    @Autowired
    private EsforcoFaseSearchRepository esforcoFaseSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restEsforcoFaseMockMvc;

    private EsforcoFase esforcoFase;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            EsforcoFaseResource esforcoFaseResource = new EsforcoFaseResource(esforcoFaseRepository, esforcoFaseSearchRepository);
        this.restEsforcoFaseMockMvc = MockMvcBuilders.standaloneSetup(esforcoFaseResource)
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
    public static EsforcoFase createEntity(EntityManager em) {
        EsforcoFase esforcoFase = new EsforcoFase()
                .esforco(DEFAULT_ESFORCO);
        return esforcoFase;
    }

    @Before
    public void initTest() {
        esforcoFaseSearchRepository.deleteAll();
        esforcoFase = createEntity(em);
    }

    @Test
    @Transactional
    public void createEsforcoFase() throws Exception {
        int databaseSizeBeforeCreate = esforcoFaseRepository.findAll().size();

        // Create the EsforcoFase

        restEsforcoFaseMockMvc.perform(post("/api/esforco-fases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(esforcoFase)))
            .andExpect(status().isCreated());

        // Validate the EsforcoFase in the database
        List<EsforcoFase> esforcoFaseList = esforcoFaseRepository.findAll();
        assertThat(esforcoFaseList).hasSize(databaseSizeBeforeCreate + 1);
        EsforcoFase testEsforcoFase = esforcoFaseList.get(esforcoFaseList.size() - 1);
        assertThat(testEsforcoFase.getEsforco()).isEqualTo(DEFAULT_ESFORCO);

        // Validate the EsforcoFase in Elasticsearch
        EsforcoFase esforcoFaseEs = esforcoFaseSearchRepository.findOne(testEsforcoFase.getId());
        assertThat(esforcoFaseEs).isEqualToComparingFieldByField(testEsforcoFase);
    }

    @Test
    @Transactional
    public void createEsforcoFaseWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = esforcoFaseRepository.findAll().size();

        // Create the EsforcoFase with an existing ID
        EsforcoFase existingEsforcoFase = new EsforcoFase();
        existingEsforcoFase.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEsforcoFaseMockMvc.perform(post("/api/esforco-fases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingEsforcoFase)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<EsforcoFase> esforcoFaseList = esforcoFaseRepository.findAll();
        assertThat(esforcoFaseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllEsforcoFases() throws Exception {
        // Initialize the database
        esforcoFaseRepository.saveAndFlush(esforcoFase);

        // Get all the esforcoFaseList
        restEsforcoFaseMockMvc.perform(get("/api/esforco-fases?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(esforcoFase.getId().intValue())))
            .andExpect(jsonPath("$.[*].esforco").value(hasItem(DEFAULT_ESFORCO.intValue())));
    }

    @Test
    @Transactional
    public void getEsforcoFase() throws Exception {
        // Initialize the database
        esforcoFaseRepository.saveAndFlush(esforcoFase);

        // Get the esforcoFase
        restEsforcoFaseMockMvc.perform(get("/api/esforco-fases/{id}", esforcoFase.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(esforcoFase.getId().intValue()))
            .andExpect(jsonPath("$.esforco").value(DEFAULT_ESFORCO.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingEsforcoFase() throws Exception {
        // Get the esforcoFase
        restEsforcoFaseMockMvc.perform(get("/api/esforco-fases/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEsforcoFase() throws Exception {
        // Initialize the database
        esforcoFaseRepository.saveAndFlush(esforcoFase);
        esforcoFaseSearchRepository.save(esforcoFase);
        int databaseSizeBeforeUpdate = esforcoFaseRepository.findAll().size();

        // Update the esforcoFase
        EsforcoFase updatedEsforcoFase = esforcoFaseRepository.findOne(esforcoFase.getId());
        updatedEsforcoFase
                .esforco(UPDATED_ESFORCO);

        restEsforcoFaseMockMvc.perform(put("/api/esforco-fases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEsforcoFase)))
            .andExpect(status().isOk());

        // Validate the EsforcoFase in the database
        List<EsforcoFase> esforcoFaseList = esforcoFaseRepository.findAll();
        assertThat(esforcoFaseList).hasSize(databaseSizeBeforeUpdate);
        EsforcoFase testEsforcoFase = esforcoFaseList.get(esforcoFaseList.size() - 1);
        assertThat(testEsforcoFase.getEsforco()).isEqualTo(UPDATED_ESFORCO);

        // Validate the EsforcoFase in Elasticsearch
        EsforcoFase esforcoFaseEs = esforcoFaseSearchRepository.findOne(testEsforcoFase.getId());
        assertThat(esforcoFaseEs).isEqualToComparingFieldByField(testEsforcoFase);
    }

    @Test
    @Transactional
    public void updateNonExistingEsforcoFase() throws Exception {
        int databaseSizeBeforeUpdate = esforcoFaseRepository.findAll().size();

        // Create the EsforcoFase

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restEsforcoFaseMockMvc.perform(put("/api/esforco-fases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(esforcoFase)))
            .andExpect(status().isCreated());

        // Validate the EsforcoFase in the database
        List<EsforcoFase> esforcoFaseList = esforcoFaseRepository.findAll();
        assertThat(esforcoFaseList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteEsforcoFase() throws Exception {
        // Initialize the database
        esforcoFaseRepository.saveAndFlush(esforcoFase);
        esforcoFaseSearchRepository.save(esforcoFase);
        int databaseSizeBeforeDelete = esforcoFaseRepository.findAll().size();

        // Get the esforcoFase
        restEsforcoFaseMockMvc.perform(delete("/api/esforco-fases/{id}", esforcoFase.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean esforcoFaseExistsInEs = esforcoFaseSearchRepository.exists(esforcoFase.getId());
        assertThat(esforcoFaseExistsInEs).isFalse();

        // Validate the database is empty
        List<EsforcoFase> esforcoFaseList = esforcoFaseRepository.findAll();
        assertThat(esforcoFaseList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchEsforcoFase() throws Exception {
        // Initialize the database
        esforcoFaseRepository.saveAndFlush(esforcoFase);
        esforcoFaseSearchRepository.save(esforcoFase);

        // Search the esforcoFase
        restEsforcoFaseMockMvc.perform(get("/api/_search/esforco-fases?query=id:" + esforcoFase.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(esforcoFase.getId().intValue())))
            .andExpect(jsonPath("$.[*].esforco").value(hasItem(DEFAULT_ESFORCO.intValue())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EsforcoFase.class);
    }
}
