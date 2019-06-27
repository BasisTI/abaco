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
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.repository.TipoEquipeRepository;
import br.com.basis.abaco.repository.search.TipoEquipeSearchRepository;
import br.com.basis.abaco.service.TipoEquipeService;
import br.com.basis.abaco.web.rest.errors.ExceptionTranslator;
import br.com.basis.dynamicexports.service.DynamicExportsService;

/**
 * Test class for the TipoEquipeResource REST controller.
 *
 * @see TipoEquipeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class TipoEquipeResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private TipoEquipeRepository tipoEquipeRepository;

    @Autowired
    private TipoEquipeSearchRepository tipoEquipeSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private DynamicExportsService dynamicExportsService;

    @Autowired
    private TipoEquipeService tipoEquipeService;

    private MockMvc restTipoEquipeMockMvc;

    private TipoEquipe tipoEquipe;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TipoEquipeResource tipoEquipeResource = new TipoEquipeResource(tipoEquipeRepository,
                tipoEquipeSearchRepository, dynamicExportsService, tipoEquipeService);
        this.restTipoEquipeMockMvc = MockMvcBuilders.standaloneSetup(tipoEquipeResource)
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
    public static TipoEquipe createEntity(EntityManager em) {
        TipoEquipe tipoEquipe = new TipoEquipe()
            .nome(DEFAULT_NOME);
        return tipoEquipe;
    }

    @Before
    public void initTest() {
        tipoEquipeSearchRepository.deleteAll();
        tipoEquipe = createEntity(em);
    }

    @Test
    @Transactional
    public void createTipoEquipe() throws Exception {
        int databaseSizeBeforeCreate = tipoEquipeRepository.findAll().size();

        // Create the TipoEquipe
        restTipoEquipeMockMvc.perform(post("/api/tipo-equipes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tipoEquipe)))
            .andExpect(status().isCreated());

        // Validate the TipoEquipe in the database
        List<TipoEquipe> tipoEquipeList = tipoEquipeRepository.findAll();
        assertThat(tipoEquipeList).hasSize(databaseSizeBeforeCreate + 1);
        TipoEquipe testTipoEquipe = tipoEquipeList.get(tipoEquipeList.size() - 1);
        assertThat(testTipoEquipe.getNome()).isEqualTo(DEFAULT_NOME);

        // Validate the TipoEquipe in Elasticsearch
        TipoEquipe tipoEquipeEs = tipoEquipeSearchRepository.findOne(testTipoEquipe.getId());
        assertThat(tipoEquipeEs).isEqualToIgnoringGivenFields(testTipoEquipe);
    }

    @Test
    @Transactional
    public void createTipoEquipeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tipoEquipeRepository.findAll().size();

        // Create the TipoEquipe with an existing ID
        tipoEquipe.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTipoEquipeMockMvc.perform(post("/api/tipo-equipes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tipoEquipe)))
            .andExpect(status().isBadRequest());

        // Validate the TipoEquipe in the database
        List<TipoEquipe> tipoEquipeList = tipoEquipeRepository.findAll();
        assertThat(tipoEquipeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = tipoEquipeRepository.findAll().size();
        // set the field null
        tipoEquipe.setNome(null);

        // Create the TipoEquipe, which fails.

        restTipoEquipeMockMvc.perform(post("/api/tipo-equipes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tipoEquipe)))
            .andExpect(status().isBadRequest());

        List<TipoEquipe> tipoEquipeList = tipoEquipeRepository.findAll();
        assertThat(tipoEquipeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTipoEquipes() throws Exception {
        // Initialize the database
        tipoEquipeRepository.saveAndFlush(tipoEquipe);

        // Get all the tipoEquipeList
        restTipoEquipeMockMvc.perform(get("/api/tipo-equipes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tipoEquipe.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }

    @Test
    @Transactional
    public void getTipoEquipe() throws Exception {
        // Initialize the database
        tipoEquipeRepository.saveAndFlush(tipoEquipe);

        // Get the tipoEquipe
        restTipoEquipeMockMvc.perform(get("/api/tipo-equipes/{id}", tipoEquipe.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(tipoEquipe.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingTipoEquipe() throws Exception {
        // Get the tipoEquipe
        restTipoEquipeMockMvc.perform(get("/api/tipo-equipes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTipoEquipe() throws Exception {
        // Initialize the database
        tipoEquipeRepository.saveAndFlush(tipoEquipe);
        tipoEquipeSearchRepository.save(tipoEquipe);
        int databaseSizeBeforeUpdate = tipoEquipeRepository.findAll().size();

        // Update the tipoEquipe
        TipoEquipe updatedTipoEquipe = tipoEquipeRepository.findOne(tipoEquipe.getId());
        // Disconnect from session so that the updates on updatedTipoEquipe are not directly saved in db
        em.detach(updatedTipoEquipe);
        updatedTipoEquipe
            .nome(UPDATED_NOME);

        restTipoEquipeMockMvc.perform(put("/api/tipo-equipes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTipoEquipe)))
            .andExpect(status().isOk());

        // Validate the TipoEquipe in the database
        List<TipoEquipe> tipoEquipeList = tipoEquipeRepository.findAll();
        assertThat(tipoEquipeList).hasSize(databaseSizeBeforeUpdate);
        TipoEquipe testTipoEquipe = tipoEquipeList.get(tipoEquipeList.size() - 1);
        assertThat(testTipoEquipe.getNome()).isEqualTo(UPDATED_NOME);

        // Validate the TipoEquipe in Elasticsearch
        TipoEquipe tipoEquipeEs = tipoEquipeSearchRepository.findOne(testTipoEquipe.getId());
        assertThat(tipoEquipeEs).isEqualToIgnoringGivenFields(testTipoEquipe);
    }

    @Test
    @Transactional
    public void updateNonExistingTipoEquipe() throws Exception {
        int databaseSizeBeforeUpdate = tipoEquipeRepository.findAll().size();

        // Create the TipoEquipe

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restTipoEquipeMockMvc.perform(put("/api/tipo-equipes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(tipoEquipe)))
            .andExpect(status().isCreated());

        // Validate the TipoEquipe in the database
        List<TipoEquipe> tipoEquipeList = tipoEquipeRepository.findAll();
        assertThat(tipoEquipeList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteTipoEquipe() throws Exception {
        // Initialize the database
        tipoEquipeRepository.saveAndFlush(tipoEquipe);
        tipoEquipeSearchRepository.save(tipoEquipe);
        int databaseSizeBeforeDelete = tipoEquipeRepository.findAll().size();

        // Get the tipoEquipe
        restTipoEquipeMockMvc.perform(delete("/api/tipo-equipes/{id}", tipoEquipe.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean tipoEquipeExistsInEs = tipoEquipeSearchRepository.exists(tipoEquipe.getId());
        assertThat(tipoEquipeExistsInEs).isFalse();

        // Validate the database is empty
        List<TipoEquipe> tipoEquipeList = tipoEquipeRepository.findAll();
        assertThat(tipoEquipeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchTipoEquipe() throws Exception {
        // Initialize the database
        tipoEquipeRepository.saveAndFlush(tipoEquipe);
        tipoEquipeSearchRepository.save(tipoEquipe);

        // Search the tipoEquipe
        restTipoEquipeMockMvc.perform(get("/api/_search/tipo-equipes?query=id:" + tipoEquipe.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tipoEquipe.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TipoEquipe.class);
        TipoEquipe tipoEquipe1 = new TipoEquipe();
        tipoEquipe1.setId(1L);
        TipoEquipe tipoEquipe2 = new TipoEquipe();
        tipoEquipe2.setId(tipoEquipe1.getId());
        assertThat(tipoEquipe1).isEqualTo(tipoEquipe2);
        tipoEquipe2.setId(2L);
        assertThat(tipoEquipe1).isNotEqualTo(tipoEquipe2);
        tipoEquipe1.setId(null);
        assertThat(tipoEquipe1).isNotEqualTo(tipoEquipe2);
    }
}
