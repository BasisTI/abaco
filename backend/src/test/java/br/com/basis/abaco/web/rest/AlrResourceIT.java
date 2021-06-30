package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.AbacoApp;

import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.repository.AlrRepository;
import br.com.basis.abaco.repository.search.AlrSearchRepository;
import br.com.basis.abaco.service.AlrService;
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
 * Test class for the AlrResource REST controller.
 *
 * @see AlrResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class AlrResourceIT {

    @Autowired
    private AlrRepository alrRepository;

    @Autowired
    private AlrSearchRepository alrSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restAlrMockMvc;

    private Alr alr;

    @Autowired
    private AlrService alrService;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            AlrResource alrResource = new AlrResource(alrRepository, alrSearchRepository, alrService);
        this.restAlrMockMvc = MockMvcBuilders.standaloneSetup(alrResource)
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
    public static Alr createEntity(EntityManager em) {
        Alr alr = new Alr();
        return alr;
    }

    @Before
    public void initTest() {
        alrSearchRepository.deleteAll();
        alr = createEntity(em);
    }

    @Test
    @Transactional
    public void createAlr() throws Exception {
        int databaseSizeBeforeCreate = alrRepository.findAll().size();

        // Create the Alr

        restAlrMockMvc.perform(post("/api/alrs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(alr)))
            .andExpect(status().isCreated());

        // Validate the Alr in the database
        List<Alr> alrList = alrRepository.findAll();
        assertThat(alrList).hasSize(databaseSizeBeforeCreate + 1);
        Alr testAlr = alrList.get(alrList.size() - 1);

        // Validate the Alr in Elasticsearch
        Alr alrEs = alrSearchRepository.findOne(testAlr.getId());
        assertThat(alrEs).isEqualToComparingFieldByField(testAlr);
    }

    @Test
    @Transactional
    public void createAlrWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = alrRepository.findAll().size();

        // Create the Alr with an existing ID
        Alr existingAlr = new Alr();
        existingAlr.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAlrMockMvc.perform(post("/api/alrs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingAlr)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Alr> alrList = alrRepository.findAll();
        assertThat(alrList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllAlrs() throws Exception {
        // Initialize the database
        alrRepository.saveAndFlush(alr);

        // Get all the alrList
        restAlrMockMvc.perform(get("/api/alrs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(alr.getId().intValue())));
    }

    @Test
    @Transactional
    public void getAlr() throws Exception {
        // Initialize the database
        alrRepository.saveAndFlush(alr);

        // Get the alr
        restAlrMockMvc.perform(get("/api/alrs/{id}", alr.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(alr.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingAlr() throws Exception {
        // Get the alr
        restAlrMockMvc.perform(get("/api/alrs/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAlr() throws Exception {
        // Initialize the database
        alrRepository.saveAndFlush(alr);
        alrSearchRepository.save(alr);
        int databaseSizeBeforeUpdate = alrRepository.findAll().size();

        // Update the alr
        Alr updatedAlr = alrRepository.findOne(alr.getId());

        restAlrMockMvc.perform(put("/api/alrs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAlr)))
            .andExpect(status().isOk());

        // Validate the Alr in the database
        List<Alr> alrList = alrRepository.findAll();
        assertThat(alrList).hasSize(databaseSizeBeforeUpdate);
        Alr testAlr = alrList.get(alrList.size() - 1);

        // Validate the Alr in Elasticsearch
        Alr alrEs = alrSearchRepository.findOne(testAlr.getId());
        assertThat(alrEs).isEqualToComparingFieldByField(testAlr);
    }

    @Test
    @Transactional
    public void updateNonExistingAlr() throws Exception {
        int databaseSizeBeforeUpdate = alrRepository.findAll().size();

        // Create the Alr

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restAlrMockMvc.perform(put("/api/alrs")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(alr)))
            .andExpect(status().isCreated());

        // Validate the Alr in the database
        List<Alr> alrList = alrRepository.findAll();
        assertThat(alrList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteAlr() throws Exception {
        // Initialize the database
        alrRepository.saveAndFlush(alr);
        alrSearchRepository.save(alr);
        int databaseSizeBeforeDelete = alrRepository.findAll().size();

        // Get the alr
        restAlrMockMvc.perform(delete("/api/alrs/{id}", alr.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean alrExistsInEs = alrSearchRepository.exists(alr.getId());
        assertThat(alrExistsInEs).isFalse();

        // Validate the database is empty
        List<Alr> alrList = alrRepository.findAll();
        assertThat(alrList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchAlr() throws Exception {
        // Initialize the database
        alrRepository.saveAndFlush(alr);
        alrSearchRepository.save(alr);

        // Search the alr
        restAlrMockMvc.perform(get("/api/_search/alrs?query=id:" + alr.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(alr.getId().intValue())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Alr.class);
    }
}
