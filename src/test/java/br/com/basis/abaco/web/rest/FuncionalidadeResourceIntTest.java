package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.AbacoApp;

import br.com.basis.abaco.domain.Funcionalidade;
import br.com.basis.abaco.repository.FuncionalidadeRepository;
import br.com.basis.abaco.repository.search.FuncionalidadeSearchRepository;
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
 * Test class for the FuncionalidadeResource REST controller.
 *
 * @see FuncionalidadeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class FuncionalidadeResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private FuncionalidadeRepository funcionalidadeRepository;

    @Autowired
    private FuncionalidadeSearchRepository funcionalidadeSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restFuncionalidadeMockMvc;

    private Funcionalidade funcionalidade;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            FuncionalidadeResource funcionalidadeResource = new FuncionalidadeResource(funcionalidadeRepository, funcionalidadeSearchRepository);
        this.restFuncionalidadeMockMvc = MockMvcBuilders.standaloneSetup(funcionalidadeResource)
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
    public static Funcionalidade createEntity(EntityManager em) {
        Funcionalidade funcionalidade = new Funcionalidade()
                .nome(DEFAULT_NOME);
        return funcionalidade;
    }

    @Before
    public void initTest() {
        funcionalidadeSearchRepository.deleteAll();
        funcionalidade = createEntity(em);
    }

    @Test
    @Transactional
    public void createFuncionalidade() throws Exception {
        int databaseSizeBeforeCreate = funcionalidadeRepository.findAll().size();

        // Create the Funcionalidade

        restFuncionalidadeMockMvc.perform(post("/api/funcionalidades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(funcionalidade)))
            .andExpect(status().isCreated());

        // Validate the Funcionalidade in the database
        List<Funcionalidade> funcionalidadeList = funcionalidadeRepository.findAll();
        assertThat(funcionalidadeList).hasSize(databaseSizeBeforeCreate + 1);
        Funcionalidade testFuncionalidade = funcionalidadeList.get(funcionalidadeList.size() - 1);
        assertThat(testFuncionalidade.getNome()).isEqualTo(DEFAULT_NOME);

        // Validate the Funcionalidade in Elasticsearch
        Funcionalidade funcionalidadeEs = funcionalidadeSearchRepository.findOne(testFuncionalidade.getId());
        assertThat(funcionalidadeEs).isEqualToComparingFieldByField(testFuncionalidade);
    }

    @Test
    @Transactional
    public void createFuncionalidadeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = funcionalidadeRepository.findAll().size();

        // Create the Funcionalidade with an existing ID
        Funcionalidade existingFuncionalidade = new Funcionalidade();
        existingFuncionalidade.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFuncionalidadeMockMvc.perform(post("/api/funcionalidades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingFuncionalidade)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Funcionalidade> funcionalidadeList = funcionalidadeRepository.findAll();
        assertThat(funcionalidadeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = funcionalidadeRepository.findAll().size();
        // set the field null
        funcionalidade.setNome(null);

        // Create the Funcionalidade, which fails.

        restFuncionalidadeMockMvc.perform(post("/api/funcionalidades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(funcionalidade)))
            .andExpect(status().isBadRequest());

        List<Funcionalidade> funcionalidadeList = funcionalidadeRepository.findAll();
        assertThat(funcionalidadeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllFuncionalidades() throws Exception {
        // Initialize the database
        funcionalidadeRepository.saveAndFlush(funcionalidade);

        // Get all the funcionalidadeList
        restFuncionalidadeMockMvc.perform(get("/api/funcionalidades?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(funcionalidade.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }

    @Test
    @Transactional
    public void getFuncionalidade() throws Exception {
        // Initialize the database
        funcionalidadeRepository.saveAndFlush(funcionalidade);

        // Get the funcionalidade
        restFuncionalidadeMockMvc.perform(get("/api/funcionalidades/{id}", funcionalidade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(funcionalidade.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingFuncionalidade() throws Exception {
        // Get the funcionalidade
        restFuncionalidadeMockMvc.perform(get("/api/funcionalidades/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFuncionalidade() throws Exception {
        // Initialize the database
        funcionalidadeRepository.saveAndFlush(funcionalidade);
        funcionalidadeSearchRepository.save(funcionalidade);
        int databaseSizeBeforeUpdate = funcionalidadeRepository.findAll().size();

        // Update the funcionalidade
        Funcionalidade updatedFuncionalidade = funcionalidadeRepository.findOne(funcionalidade.getId());
        updatedFuncionalidade
                .nome(UPDATED_NOME);

        restFuncionalidadeMockMvc.perform(put("/api/funcionalidades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFuncionalidade)))
            .andExpect(status().isOk());

        // Validate the Funcionalidade in the database
        List<Funcionalidade> funcionalidadeList = funcionalidadeRepository.findAll();
        assertThat(funcionalidadeList).hasSize(databaseSizeBeforeUpdate);
        Funcionalidade testFuncionalidade = funcionalidadeList.get(funcionalidadeList.size() - 1);
        assertThat(testFuncionalidade.getNome()).isEqualTo(UPDATED_NOME);

        // Validate the Funcionalidade in Elasticsearch
        Funcionalidade funcionalidadeEs = funcionalidadeSearchRepository.findOne(testFuncionalidade.getId());
        assertThat(funcionalidadeEs).isEqualToComparingFieldByField(testFuncionalidade);
    }

    @Test
    @Transactional
    public void updateNonExistingFuncionalidade() throws Exception {
        int databaseSizeBeforeUpdate = funcionalidadeRepository.findAll().size();

        // Create the Funcionalidade

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restFuncionalidadeMockMvc.perform(put("/api/funcionalidades")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(funcionalidade)))
            .andExpect(status().isCreated());

        // Validate the Funcionalidade in the database
        List<Funcionalidade> funcionalidadeList = funcionalidadeRepository.findAll();
        assertThat(funcionalidadeList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteFuncionalidade() throws Exception {
        // Initialize the database
        funcionalidadeRepository.saveAndFlush(funcionalidade);
        funcionalidadeSearchRepository.save(funcionalidade);
        int databaseSizeBeforeDelete = funcionalidadeRepository.findAll().size();

        // Get the funcionalidade
        restFuncionalidadeMockMvc.perform(delete("/api/funcionalidades/{id}", funcionalidade.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean funcionalidadeExistsInEs = funcionalidadeSearchRepository.exists(funcionalidade.getId());
        assertThat(funcionalidadeExistsInEs).isFalse();

        // Validate the database is empty
        List<Funcionalidade> funcionalidadeList = funcionalidadeRepository.findAll();
        assertThat(funcionalidadeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchFuncionalidade() throws Exception {
        // Initialize the database
        funcionalidadeRepository.saveAndFlush(funcionalidade);
        funcionalidadeSearchRepository.save(funcionalidade);

        // Search the funcionalidade
        restFuncionalidadeMockMvc.perform(get("/api/_search/funcionalidades?query=id:" + funcionalidade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(funcionalidade.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Funcionalidade.class);
    }
}
