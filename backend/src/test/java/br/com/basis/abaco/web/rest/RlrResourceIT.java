package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.AbacoApp;

import br.com.basis.abaco.domain.Rlr;
import br.com.basis.abaco.repository.RlrRepository;
import br.com.basis.abaco.repository.search.RlrSearchRepository;
import br.com.basis.abaco.service.RlrService;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the RlrResource REST controller.
 *
 * @see RlrResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class RlrResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private RlrRepository rlrRepository;

    @Autowired
    private RlrSearchRepository rlrSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restRlrMockMvc;

    private Rlr rlr;

    @Autowired
    private RlrService rlrService;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            RlrResource rlrResource = new RlrResource(rlrRepository, rlrSearchRepository, rlrService);
        this.restRlrMockMvc = MockMvcBuilders.standaloneSetup(rlrResource)
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
    public static Rlr createEntity(EntityManager em) {
        Rlr rlr = new Rlr()
                .nome(DEFAULT_NOME);
        return rlr;
    }

    @Before
    public void initTest() {
        rlrSearchRepository.deleteAll();
        rlr = createEntity(em);
    }

    @Test
    @Transactional
    public void createRlr() throws Exception {
        int databaseSizeBeforeCreate = rlrRepository.findAll().size();

        // Create the Rlr

        restRlrMockMvc.perform(post("/api/rlrs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(rlr)))
            .andExpect(status().isCreated());

        // Validate the Rlr in the database
        List<Rlr> rlrList = rlrRepository.findAll();
        assertThat(rlrList).hasSize(databaseSizeBeforeCreate + 1);
        Rlr testRlr = rlrList.get(rlrList.size() - 1);
        assertThat(testRlr.getNome()).isEqualTo(DEFAULT_NOME);

        // Validate the Rlr in Elasticsearch
        Rlr rlrEs = rlrSearchRepository.findOne(testRlr.getId());
        assertThat(rlrEs).isEqualToComparingFieldByField(testRlr);
    }

    @Test
    @Transactional
    public void createRlrWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = rlrRepository.findAll().size();

        // Create the Rlr with an existing ID
        Rlr existingRlr = new Rlr();
        existingRlr.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restRlrMockMvc.perform(post("/api/rlrs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingRlr)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Rlr> rlrList = rlrRepository.findAll();
        assertThat(rlrList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = rlrRepository.findAll().size();
        // set the field null
        rlr.setNome(null);

        // Create the Rlr, which fails.

        restRlrMockMvc.perform(post("/api/rlrs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(rlr)))
            .andExpect(status().isBadRequest());

        List<Rlr> rlrList = rlrRepository.findAll();
        assertThat(rlrList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllRlrs() throws Exception {
        // Initialize the database
        rlrRepository.saveAndFlush(rlr);

        // Get all the rlrList
        restRlrMockMvc.perform(get("/api/rlrs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rlr.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }

    @Test
    @Transactional
    public void getRlr() throws Exception {
        // Initialize the database
        rlrRepository.saveAndFlush(rlr);

        // Get the rlr
        restRlrMockMvc.perform(get("/api/rlrs/{id}", rlr.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(rlr.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingRlr() throws Exception {
        // Get the rlr
        restRlrMockMvc.perform(get("/api/rlrs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateRlr() throws Exception {
        // Initialize the database
        rlrRepository.saveAndFlush(rlr);
        rlrSearchRepository.save(rlr);
        int databaseSizeBeforeUpdate = rlrRepository.findAll().size();

        // Update the rlr
        Rlr updatedRlr = rlrRepository.findOne(rlr.getId());
        updatedRlr
                .nome(UPDATED_NOME);

        restRlrMockMvc.perform(put("/api/rlrs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedRlr)))
            .andExpect(status().isOk());

        // Validate the Rlr in the database
        List<Rlr> rlrList = rlrRepository.findAll();
        assertThat(rlrList).hasSize(databaseSizeBeforeUpdate);
        Rlr testRlr = rlrList.get(rlrList.size() - 1);
        assertThat(testRlr.getNome()).isEqualTo(UPDATED_NOME);

        // Validate the Rlr in Elasticsearch
        Rlr rlrEs = rlrSearchRepository.findOne(testRlr.getId());
        assertThat(rlrEs).isEqualToComparingFieldByField(testRlr);
    }

    @Test
    @Transactional
    public void updateNonExistingRlr() throws Exception {
        int databaseSizeBeforeUpdate = rlrRepository.findAll().size();

        // Create the Rlr

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restRlrMockMvc.perform(put("/api/rlrs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(rlr)))
            .andExpect(status().isCreated());

        // Validate the Rlr in the database
        List<Rlr> rlrList = rlrRepository.findAll();
        assertThat(rlrList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteRlr() throws Exception {
        // Initialize the database
        rlrRepository.saveAndFlush(rlr);
        rlrSearchRepository.save(rlr);
        int databaseSizeBeforeDelete = rlrRepository.findAll().size();

        // Get the rlr
        restRlrMockMvc.perform(delete("/api/rlrs/{id}", rlr.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean rlrExistsInEs = rlrSearchRepository.exists(rlr.getId());
        assertThat(rlrExistsInEs).isFalse();

        // Validate the database is empty
        List<Rlr> rlrList = rlrRepository.findAll();
        assertThat(rlrList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchRlr() throws Exception {
        // Initialize the database
        rlrRepository.saveAndFlush(rlr);
        rlrSearchRepository.save(rlr);

        // Search the rlr
        restRlrMockMvc.perform(get("/api/_search/rlrs?query=id:" + rlr.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rlr.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Rlr.class);
    }
}
