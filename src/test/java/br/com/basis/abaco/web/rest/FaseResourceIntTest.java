package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.AbacoApp;

import br.com.basis.abaco.domain.Fase;
import br.com.basis.abaco.repository.FaseRepository;
import br.com.basis.abaco.repository.search.FaseSearchRepository;
import br.com.basis.abaco.web.rest.errors.ExceptionTranslator;

import br.com.basis.dynamicexports.service.DynamicExportsService;
import com.netflix.discovery.converters.Auto;
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
 * Test class for the FaseResource REST controller.
 *
 * @see FaseResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class FaseResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private FaseRepository faseRepository;

    @Autowired
    private FaseSearchRepository faseSearchRepository;

    @Autowired
    private DynamicExportsService dynamicExportsService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restFaseMockMvc;

    private Fase fase;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            FaseResource faseResource = new FaseResource(faseRepository, faseSearchRepository, dynamicExportsService);
        this.restFaseMockMvc = MockMvcBuilders.standaloneSetup(faseResource)
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
    public static Fase createEntity(EntityManager em) {
        Fase fase = new Fase()
                .nome(DEFAULT_NOME);
        return fase;
    }

    @Before
    public void initTest() {
        faseSearchRepository.deleteAll();
        fase = createEntity(em);
    }

    @Test
    @Transactional
    public void createFase() throws Exception {
        int databaseSizeBeforeCreate = faseRepository.findAll().size();

        // Create the Fase

        restFaseMockMvc.perform(post("/api/fases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fase)))
            .andExpect(status().isCreated());

        // Validate the Fase in the database
        List<Fase> faseList = faseRepository.findAll();
        assertThat(faseList).hasSize(databaseSizeBeforeCreate + 1);
        Fase testFase = faseList.get(faseList.size() - 1);
        assertThat(testFase.getNome()).isEqualTo(DEFAULT_NOME);

        // Validate the Fase in Elasticsearch
        Fase faseEs = faseSearchRepository.findOne(testFase.getId());
        assertThat(faseEs).isEqualToComparingFieldByField(testFase);
    }

    @Test
    @Transactional
    public void createFaseWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = faseRepository.findAll().size();

        // Create the Fase with an existing ID
        Fase existingFase = new Fase();
        existingFase.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFaseMockMvc.perform(post("/api/fases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingFase)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Fase> faseList = faseRepository.findAll();
        assertThat(faseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllFases() throws Exception {
        // Initialize the database
        faseRepository.saveAndFlush(fase);

        // Get all the faseList
        restFaseMockMvc.perform(get("/api/fases?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fase.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }

    @Test
    @Transactional
    public void getFase() throws Exception {
        // Initialize the database
        faseRepository.saveAndFlush(fase);

        // Get the fase
        restFaseMockMvc.perform(get("/api/fases/{id}", fase.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(fase.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingFase() throws Exception {
        // Get the fase
        restFaseMockMvc.perform(get("/api/fases/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFase() throws Exception {
        // Initialize the database
        faseRepository.saveAndFlush(fase);
        faseSearchRepository.save(fase);
        int databaseSizeBeforeUpdate = faseRepository.findAll().size();

        // Update the fase
        Fase updatedFase = faseRepository.findOne(fase.getId());
        updatedFase
                .nome(UPDATED_NOME);

        restFaseMockMvc.perform(put("/api/fases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFase)))
            .andExpect(status().isOk());

        // Validate the Fase in the database
        List<Fase> faseList = faseRepository.findAll();
        assertThat(faseList).hasSize(databaseSizeBeforeUpdate);
        Fase testFase = faseList.get(faseList.size() - 1);
        assertThat(testFase.getNome()).isEqualTo(UPDATED_NOME);

        // Validate the Fase in Elasticsearch
        Fase faseEs = faseSearchRepository.findOne(testFase.getId());
        assertThat(faseEs).isEqualToComparingFieldByField(testFase);
    }

    @Test
    @Transactional
    public void updateNonExistingFase() throws Exception {
        int databaseSizeBeforeUpdate = faseRepository.findAll().size();

        // Create the Fase

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restFaseMockMvc.perform(put("/api/fases")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fase)))
            .andExpect(status().isCreated());

        // Validate the Fase in the database
        List<Fase> faseList = faseRepository.findAll();
        assertThat(faseList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteFase() throws Exception {
        // Initialize the database
        faseRepository.saveAndFlush(fase);
        faseSearchRepository.save(fase);
        int databaseSizeBeforeDelete = faseRepository.findAll().size();

        // Get the fase
        restFaseMockMvc.perform(delete("/api/fases/{id}", fase.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean faseExistsInEs = faseSearchRepository.exists(fase.getId());
        assertThat(faseExistsInEs).isFalse();

        // Validate the database is empty
        List<Fase> faseList = faseRepository.findAll();
        assertThat(faseList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchFase() throws Exception {
        // Initialize the database
        faseRepository.saveAndFlush(fase);
        faseSearchRepository.save(fase);

        // Search the fase
        restFaseMockMvc.perform(get("/api/_search/fases?query=id:" + fase.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fase.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Fase.class);
    }
}
