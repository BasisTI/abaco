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
import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.repository.DerRepository;
import br.com.basis.abaco.repository.search.DerSearchRepository;
import br.com.basis.abaco.service.DerService;
import br.com.basis.abaco.web.rest.errors.ExceptionTranslator;

/**
 * Test class for the DerResource REST controller.
 *
 * @see DerResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class DerResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private DerRepository derRepository;

    @Autowired
    private DerSearchRepository derSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private DerService derService;

    private MockMvc restDerMockMvc;

    private Der der;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        DerResource derResource = new DerResource(derRepository, derSearchRepository, derService);
        this.restDerMockMvc = MockMvcBuilders.standaloneSetup(derResource)
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
    public static Der createEntity(EntityManager em) {
        Der der = new Der()
                .nome(DEFAULT_NOME);
        return der;
    }

    @Before
    public void initTest() {
        derSearchRepository.deleteAll();
        der = createEntity(em);
    }

    @Test
    @Transactional
    public void createDer() throws Exception {
        int databaseSizeBeforeCreate = derRepository.findAll().size();

        // Create the Der

        restDerMockMvc.perform(post("/api/ders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(der)))
            .andExpect(status().isCreated());

        // Validate the Der in the database
        List<Der> derList = derRepository.findAll();
        assertThat(derList).hasSize(databaseSizeBeforeCreate + 1);
        Der testDer = derList.get(derList.size() - 1);
        assertThat(testDer.getNome()).isEqualTo(DEFAULT_NOME);

        // Validate the Der in Elasticsearch
        Der derEs = derSearchRepository.findOne(testDer.getId());
        assertThat(derEs).isEqualToComparingFieldByField(testDer);
    }

    @Test
    @Transactional
    public void createDerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = derRepository.findAll().size();

        // Create the Der with an existing ID
        Der existingDer = new Der();
        existingDer.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDerMockMvc.perform(post("/api/ders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingDer)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Der> derList = derRepository.findAll();
        assertThat(derList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = derRepository.findAll().size();
        // set the field null
        der.setNome(null);

        // Create the Der, which fails.

        restDerMockMvc.perform(post("/api/ders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(der)))
            .andExpect(status().isBadRequest());

        List<Der> derList = derRepository.findAll();
        assertThat(derList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDers() throws Exception {
        // Initialize the database
        derRepository.saveAndFlush(der);

        // Get all the derList
        restDerMockMvc.perform(get("/api/ders?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(der.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }

    @Test
    @Transactional
    public void getDer() throws Exception {
        // Initialize the database
        derRepository.saveAndFlush(der);

        // Get the der
        restDerMockMvc.perform(get("/api/ders/{id}", der.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(der.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingDer() throws Exception {
        // Get the der
        restDerMockMvc.perform(get("/api/ders/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDer() throws Exception {
        // Initialize the database
        derRepository.saveAndFlush(der);
        derSearchRepository.save(der);
        int databaseSizeBeforeUpdate = derRepository.findAll().size();

        // Update the der
        Der updatedDer = derRepository.findOne(der.getId());
        updatedDer
                .nome(UPDATED_NOME);

        restDerMockMvc.perform(put("/api/ders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedDer)))
            .andExpect(status().isOk());

        // Validate the Der in the database
        List<Der> derList = derRepository.findAll();
        assertThat(derList).hasSize(databaseSizeBeforeUpdate);
        Der testDer = derList.get(derList.size() - 1);
        assertThat(testDer.getNome()).isEqualTo(UPDATED_NOME);

        // Validate the Der in Elasticsearch
        Der derEs = derSearchRepository.findOne(testDer.getId());
        assertThat(derEs).isEqualToComparingFieldByField(testDer);
    }

    @Test
    @Transactional
    public void updateNonExistingDer() throws Exception {
        int databaseSizeBeforeUpdate = derRepository.findAll().size();

        // Create the Der

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restDerMockMvc.perform(put("/api/ders")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(der)))
            .andExpect(status().isCreated());

        // Validate the Der in the database
        List<Der> derList = derRepository.findAll();
        assertThat(derList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteDer() throws Exception {
        // Initialize the database
        derRepository.saveAndFlush(der);
        derSearchRepository.save(der);
        int databaseSizeBeforeDelete = derRepository.findAll().size();

        // Get the der
        restDerMockMvc.perform(delete("/api/ders/{id}", der.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean derExistsInEs = derSearchRepository.exists(der.getId());
        assertThat(derExistsInEs).isFalse();

        // Validate the database is empty
        List<Der> derList = derRepository.findAll();
        assertThat(derList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchDer() throws Exception {
        // Initialize the database
        derRepository.saveAndFlush(der);
        derSearchRepository.save(der);

        // Search the der
        restDerMockMvc.perform(get("/api/_search/ders?query=id:" + der.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(der.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Der.class);
    }
}
