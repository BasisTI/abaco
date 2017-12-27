package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.AbacoApp;

import br.com.basis.abaco.domain.TipoFase;
import br.com.basis.abaco.repository.TipoFaseRepository;
import br.com.basis.abaco.repository.search.TipoFaseSearchRepository;
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
import java.util.List;

import static br.com.basis.abaco.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TipoFaseResource REST controller.
 *
 * @see TipoFaseResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class TipoFaseResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private TipoFaseRepository tipoFaseRepository;

    @Autowired
    private TipoFaseSearchRepository tipoFaseSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restTipoFaseMockMvc;

    private TipoFase tipoFase;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TipoFaseResource tipoFaseResource = new TipoFaseResource(tipoFaseRepository, tipoFaseSearchRepository);
        this.restTipoFaseMockMvc = MockMvcBuilders.standaloneSetup(tipoFaseResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static TipoFase createEntity(EntityManager em) {
        TipoFase tipoFase = new TipoFase()
            .nome(DEFAULT_NOME);
        return tipoFase;
    }

    @Before
    public void initTest() {
        tipoFaseSearchRepository.deleteAll();
        tipoFase = createEntity(em);
    }

    @Test
    @Transactional
    public void createTipoFase() throws Exception {
        int databaseSizeBeforeCreate = tipoFaseRepository.findAll().size();

        // Create the TipoFase
        restTipoFaseMockMvc.perform(post("/api/tipo-fases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tipoFase)))
            .andExpect(status().isCreated());

        // Validate the TipoFase in the database
        List<TipoFase> tipoFaseList = tipoFaseRepository.findAll();
        assertThat(tipoFaseList).hasSize(databaseSizeBeforeCreate + 1);
        TipoFase testTipoFase = tipoFaseList.get(tipoFaseList.size() - 1);
        assertThat(testTipoFase.getNome()).isEqualTo(DEFAULT_NOME);

        // Validate the TipoFase in Elasticsearch
        TipoFase tipoFaseEs = tipoFaseSearchRepository.findOne(testTipoFase.getId());
        assertThat(tipoFaseEs).isEqualToIgnoringGivenFields(testTipoFase);
    }

    @Test
    @Transactional
    public void createTipoFaseWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tipoFaseRepository.findAll().size();

        // Create the TipoFase with an existing ID
        tipoFase.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTipoFaseMockMvc.perform(post("/api/tipo-fases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tipoFase)))
            .andExpect(status().isBadRequest());

        // Validate the TipoFase in the database
        List<TipoFase> tipoFaseList = tipoFaseRepository.findAll();
        assertThat(tipoFaseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllTipoFases() throws Exception {
        // Initialize the database
        tipoFaseRepository.saveAndFlush(tipoFase);

        // Get all the tipoFaseList
        restTipoFaseMockMvc.perform(get("/api/tipo-fases?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tipoFase.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }

    @Test
    @Transactional
    public void getTipoFase() throws Exception {
        // Initialize the database
        tipoFaseRepository.saveAndFlush(tipoFase);

        // Get the tipoFase
        restTipoFaseMockMvc.perform(get("/api/tipo-fases/{id}", tipoFase.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(tipoFase.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTipoFase() throws Exception {
        // Get the tipoFase
        restTipoFaseMockMvc.perform(get("/api/tipo-fases/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTipoFase() throws Exception {
        // Initialize the database
        tipoFaseRepository.saveAndFlush(tipoFase);
        tipoFaseSearchRepository.save(tipoFase);
        int databaseSizeBeforeUpdate = tipoFaseRepository.findAll().size();

        // Update the tipoFase
        TipoFase updatedTipoFase = tipoFaseRepository.findOne(tipoFase.getId());
        // Disconnect from session so that the updates on updatedTipoFase are not directly saved in db
        em.detach(updatedTipoFase);
        updatedTipoFase
            .nome(UPDATED_NOME);

        restTipoFaseMockMvc.perform(put("/api/tipo-fases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTipoFase)))
            .andExpect(status().isOk());

        // Validate the TipoFase in the database
        List<TipoFase> tipoFaseList = tipoFaseRepository.findAll();
        assertThat(tipoFaseList).hasSize(databaseSizeBeforeUpdate);
        TipoFase testTipoFase = tipoFaseList.get(tipoFaseList.size() - 1);
        assertThat(testTipoFase.getNome()).isEqualTo(UPDATED_NOME);

        // Validate the TipoFase in Elasticsearch
        TipoFase tipoFaseEs = tipoFaseSearchRepository.findOne(testTipoFase.getId());
        assertThat(tipoFaseEs).isEqualToIgnoringGivenFields(testTipoFase);
    }

    @Test
    @Transactional
    public void updateNonExistingTipoFase() throws Exception {
        int databaseSizeBeforeUpdate = tipoFaseRepository.findAll().size();

        // Create the TipoFase

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restTipoFaseMockMvc.perform(put("/api/tipo-fases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tipoFase)))
            .andExpect(status().isCreated());

        // Validate the TipoFase in the database
        List<TipoFase> tipoFaseList = tipoFaseRepository.findAll();
        assertThat(tipoFaseList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteTipoFase() throws Exception {
        // Initialize the database
        tipoFaseRepository.saveAndFlush(tipoFase);
        tipoFaseSearchRepository.save(tipoFase);
        int databaseSizeBeforeDelete = tipoFaseRepository.findAll().size();

        // Get the tipoFase
        restTipoFaseMockMvc.perform(delete("/api/tipo-fases/{id}", tipoFase.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean tipoFaseExistsInEs = tipoFaseSearchRepository.exists(tipoFase.getId());
        assertThat(tipoFaseExistsInEs).isFalse();

        // Validate the database is empty
        List<TipoFase> tipoFaseList = tipoFaseRepository.findAll();
        assertThat(tipoFaseList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchTipoFase() throws Exception {
        // Initialize the database
        tipoFaseRepository.saveAndFlush(tipoFase);
        tipoFaseSearchRepository.save(tipoFase);

        // Search the tipoFase
        restTipoFaseMockMvc.perform(get("/api/_search/tipo-fases?query=id:" + tipoFase.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tipoFase.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TipoFase.class);
        TipoFase tipoFase1 = new TipoFase();
        tipoFase1.setId(1L);
        TipoFase tipoFase2 = new TipoFase();
        tipoFase2.setId(tipoFase1.getId());
        assertThat(tipoFase1).isEqualTo(tipoFase2);
        tipoFase2.setId(2L);
        assertThat(tipoFase1).isNotEqualTo(tipoFase2);
        tipoFase1.setId(null);
        assertThat(tipoFase1).isNotEqualTo(tipoFase2);
    }
}
