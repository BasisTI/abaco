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

import br.com.basis.abaco.repository.AnaliseRepository;
import br.com.basis.abaco.repository.search.AnaliseSearchRepository;
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
import br.com.basis.abaco.domain.FuncaoDados;
import br.com.basis.abaco.domain.enumeration.Complexidade;
import br.com.basis.abaco.domain.enumeration.TipoFuncaoDados;
import br.com.basis.abaco.repository.FuncaoDadosRepository;
import br.com.basis.abaco.repository.search.FuncaoDadosSearchRepository;
import br.com.basis.abaco.service.FuncaoDadosService;
import br.com.basis.abaco.web.rest.errors.ExceptionTranslator;
/**
 * Test class for the FuncaoDadosResource REST controller.
 *
 * @see FuncaoDadosResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class FuncaoDadosResourceIntTest {

    private static final TipoFuncaoDados DEFAULT_TIPO = TipoFuncaoDados.ALI;
    private static final TipoFuncaoDados UPDATED_TIPO = TipoFuncaoDados.AIE;

    private static final Complexidade DEFAULT_COMPLEXIDADE = Complexidade.BAIXA;
    private static final Complexidade UPDATED_COMPLEXIDADE = Complexidade.MEDIA;

    private static final BigDecimal DEFAULT_PF = new BigDecimal(1);
    private static final BigDecimal UPDATED_PF = new BigDecimal(2);

    @Autowired
    private FuncaoDadosRepository funcaoDadosRepository;

    @Autowired
    private FuncaoDadosSearchRepository funcaoDadosSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private FuncaoDadosService funcaoDadosService;

    private AnaliseRepository analiseRepository;

    private MockMvc restFuncaoDadosMockMvc;

    private FuncaoDados funcaoDados;

    @Autowired
    private AnaliseSearchRepository analiseSearchRepository;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        FuncaoDadosResource funcaoDadosResource = new FuncaoDadosResource(funcaoDadosRepository,
                funcaoDadosSearchRepository, funcaoDadosService, analiseRepository, analiseSearchRepository);
        this.restFuncaoDadosMockMvc = MockMvcBuilders.standaloneSetup(funcaoDadosResource)
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
    public static FuncaoDados createEntity(EntityManager em) {
        FuncaoDados funcaoDados = new FuncaoDados();
        funcaoDados.setTipo(DEFAULT_TIPO);
        funcaoDados.setComplexidade(DEFAULT_COMPLEXIDADE);
        funcaoDados.setPf(DEFAULT_PF);
        return funcaoDados;
    }

    @Before
    public void initTest() {
        funcaoDadosSearchRepository.deleteAll();
        funcaoDados = createEntity(em);
    }

    @Test
    @Transactional
    public void createFuncaoDados() throws Exception {
        int databaseSizeBeforeCreate = funcaoDadosRepository.findAll().size();

        // Create the FuncaoDados

        restFuncaoDadosMockMvc.perform(post("/api/funcao-dados")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(funcaoDados)))
            .andExpect(status().isCreated());

        // Validate the FuncaoDados in the database
        List<FuncaoDados> funcaoDadosList = funcaoDadosRepository.findAll();
        assertThat(funcaoDadosList).hasSize(databaseSizeBeforeCreate + 1);
        FuncaoDados testFuncaoDados = funcaoDadosList.get(funcaoDadosList.size() - 1);
        assertThat(testFuncaoDados.getTipo()).isEqualTo(DEFAULT_TIPO);
        assertThat(testFuncaoDados.getComplexidade()).isEqualTo(DEFAULT_COMPLEXIDADE);
        assertThat(testFuncaoDados.getPf()).isEqualTo(DEFAULT_PF);

        // Validate the FuncaoDados in Elasticsearch
        FuncaoDados funcaoDadosEs = funcaoDadosSearchRepository.findOne(testFuncaoDados.getId());
        assertThat(funcaoDadosEs).isEqualToComparingFieldByField(testFuncaoDados);
    }

    @Test
    @Transactional
    public void createFuncaoDadosWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = funcaoDadosRepository.findAll().size();

        // Create the FuncaoDados with an existing ID
        FuncaoDados existingFuncaoDados = new FuncaoDados();
        existingFuncaoDados.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFuncaoDadosMockMvc.perform(post("/api/funcao-dados")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingFuncaoDados)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<FuncaoDados> funcaoDadosList = funcaoDadosRepository.findAll();
        assertThat(funcaoDadosList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllFuncaoDados() throws Exception {
        // Initialize the database
        funcaoDadosRepository.saveAndFlush(funcaoDados);

        // Get all the funcaoDadosList
        restFuncaoDadosMockMvc.perform(get("/api/funcao-dados?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(funcaoDados.getId().intValue())))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO.toString())))
            .andExpect(jsonPath("$.[*].complexidade").value(hasItem(DEFAULT_COMPLEXIDADE.toString())))
            .andExpect(jsonPath("$.[*].pf").value(hasItem(DEFAULT_PF.intValue())));
    }

    @Test
    @Transactional
    public void getFuncaoDados() throws Exception {
        // Initialize the database
        funcaoDadosRepository.saveAndFlush(funcaoDados);

        // Get the funcaoDados
        restFuncaoDadosMockMvc.perform(get("/api/funcao-dados/{id}", funcaoDados.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(funcaoDados.getId().intValue()))
            .andExpect(jsonPath("$.tipo").value(DEFAULT_TIPO.toString()))
            .andExpect(jsonPath("$.complexidade").value(DEFAULT_COMPLEXIDADE.toString()))
            .andExpect(jsonPath("$.pf").value(DEFAULT_PF.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingFuncaoDados() throws Exception {
        // Get the funcaoDados
        restFuncaoDadosMockMvc.perform(get("/api/funcao-dados/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFuncaoDados() throws Exception {
        // Initialize the database
        funcaoDadosRepository.saveAndFlush(funcaoDados);
        funcaoDadosSearchRepository.save(funcaoDados);
        int databaseSizeBeforeUpdate = funcaoDadosRepository.findAll().size();

        // Update the funcaoDados
        FuncaoDados updatedFuncaoDados = funcaoDadosRepository.findOne(funcaoDados.getId());
        updatedFuncaoDados.setTipo(UPDATED_TIPO);
        updatedFuncaoDados.setComplexidade(UPDATED_COMPLEXIDADE);
        updatedFuncaoDados.setPf(UPDATED_PF);

        restFuncaoDadosMockMvc.perform(put("/api/funcao-dados")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFuncaoDados)))
            .andExpect(status().isOk());

        // Validate the FuncaoDados in the database
        List<FuncaoDados> funcaoDadosList = funcaoDadosRepository.findAll();
        assertThat(funcaoDadosList).hasSize(databaseSizeBeforeUpdate);
        FuncaoDados testFuncaoDados = funcaoDadosList.get(funcaoDadosList.size() - 1);
        assertThat(testFuncaoDados.getTipo()).isEqualTo(UPDATED_TIPO);
        assertThat(testFuncaoDados.getComplexidade()).isEqualTo(UPDATED_COMPLEXIDADE);
        assertThat(testFuncaoDados.getPf()).isEqualTo(UPDATED_PF);

        // Validate the FuncaoDados in Elasticsearch
        FuncaoDados funcaoDadosEs = funcaoDadosSearchRepository.findOne(testFuncaoDados.getId());
        assertThat(funcaoDadosEs).isEqualToComparingFieldByField(testFuncaoDados);
    }

    @Test
    @Transactional
    public void updateNonExistingFuncaoDados() throws Exception {
        int databaseSizeBeforeUpdate = funcaoDadosRepository.findAll().size();

        // Create the FuncaoDados

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restFuncaoDadosMockMvc.perform(put("/api/funcao-dados")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(funcaoDados)))
            .andExpect(status().isCreated());

        // Validate the FuncaoDados in the database
        List<FuncaoDados> funcaoDadosList = funcaoDadosRepository.findAll();
        assertThat(funcaoDadosList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteFuncaoDados() throws Exception {
        // Initialize the database
        funcaoDadosRepository.saveAndFlush(funcaoDados);
        funcaoDadosSearchRepository.save(funcaoDados);
        int databaseSizeBeforeDelete = funcaoDadosRepository.findAll().size();

        // Get the funcaoDados
        restFuncaoDadosMockMvc.perform(delete("/api/funcao-dados/{id}", funcaoDados.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean funcaoDadosExistsInEs = funcaoDadosSearchRepository.exists(funcaoDados.getId());
        assertThat(funcaoDadosExistsInEs).isFalse();

        // Validate the database is empty
        List<FuncaoDados> funcaoDadosList = funcaoDadosRepository.findAll();
        assertThat(funcaoDadosList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchFuncaoDados() throws Exception {
        // Initialize the database
        funcaoDadosRepository.saveAndFlush(funcaoDados);
        funcaoDadosSearchRepository.save(funcaoDados);

        // Search the funcaoDados
        restFuncaoDadosMockMvc.perform(get("/api/_search/funcao-dados?query=id:" + funcaoDados.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(funcaoDados.getId().intValue())))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO.toString())))
            .andExpect(jsonPath("$.[*].complexidade").value(hasItem(DEFAULT_COMPLEXIDADE.toString())))
            .andExpect(jsonPath("$.[*].pf").value(hasItem(DEFAULT_PF.intValue())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FuncaoDados.class);
    }
}
