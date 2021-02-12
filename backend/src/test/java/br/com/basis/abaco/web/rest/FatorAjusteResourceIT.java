package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.AbacoApp;

import br.com.basis.abaco.domain.FatorAjuste;
import br.com.basis.abaco.repository.FatorAjusteRepository;
import br.com.basis.abaco.repository.search.FatorAjusteSearchRepository;
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
import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.basis.abaco.domain.enumeration.TipoFatorAjuste;
import br.com.basis.abaco.domain.enumeration.ImpactoFatorAjuste;
/**
 * Test class for the FatorAjusteResource REST controller.
 *
 * @see FatorAjusteResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class FatorAjusteResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_FATOR = new BigDecimal(1);
    private static final BigDecimal UPDATED_FATOR = new BigDecimal(2);

    private static final Boolean DEFAULT_ATIVO = false;
    private static final Boolean UPDATED_ATIVO = true;

    private static final TipoFatorAjuste DEFAULT_TIPO_AJUSTE = TipoFatorAjuste.PERCENTUAL;
    private static final TipoFatorAjuste UPDATED_TIPO_AJUSTE = TipoFatorAjuste.UNITARIO;

    private static final ImpactoFatorAjuste DEFAULT_IMPACTO = ImpactoFatorAjuste.INCLUSAO;
    private static final ImpactoFatorAjuste UPDATED_IMPACTO = ImpactoFatorAjuste.ALTERACAO;

    @Autowired
    private FatorAjusteRepository fatorAjusteRepository;

    @Autowired
    private FatorAjusteSearchRepository fatorAjusteSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restFatorAjusteMockMvc;

    private FatorAjuste fatorAjuste;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            FatorAjusteResource fatorAjusteResource = new FatorAjusteResource(fatorAjusteRepository, fatorAjusteSearchRepository);
        this.restFatorAjusteMockMvc = MockMvcBuilders.standaloneSetup(fatorAjusteResource)
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
    public static FatorAjuste createEntity(EntityManager em) {
        FatorAjuste fatorAjuste = new FatorAjuste()
                .nome(DEFAULT_NOME)
                .fator(DEFAULT_FATOR)
                .ativo(DEFAULT_ATIVO)
                .tipoAjuste(DEFAULT_TIPO_AJUSTE)
                .impacto(DEFAULT_IMPACTO);
        return fatorAjuste;
    }

    @Before
    public void initTest() {
        fatorAjusteSearchRepository.deleteAll();
        fatorAjuste = createEntity(em);
    }

    @Test
    @Transactional
    public void createFatorAjuste() throws Exception {
        int databaseSizeBeforeCreate = fatorAjusteRepository.findAll().size();

        // Create the FatorAjuste

        restFatorAjusteMockMvc.perform(post("/api/fator-ajustes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fatorAjuste)))
            .andExpect(status().isCreated());

        // Validate the FatorAjuste in the database
        List<FatorAjuste> fatorAjusteList = fatorAjusteRepository.findAll();
        assertThat(fatorAjusteList).hasSize(databaseSizeBeforeCreate + 1);
        FatorAjuste testFatorAjuste = fatorAjusteList.get(fatorAjusteList.size() - 1);
        assertThat(testFatorAjuste.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testFatorAjuste.getFator()).isEqualTo(DEFAULT_FATOR);
        assertThat(testFatorAjuste.isAtivo()).isEqualTo(DEFAULT_ATIVO);
        assertThat(testFatorAjuste.getTipoAjuste()).isEqualTo(DEFAULT_TIPO_AJUSTE);
        assertThat(testFatorAjuste.getImpacto()).isEqualTo(DEFAULT_IMPACTO);

        // Validate the FatorAjuste in Elasticsearch
        FatorAjuste fatorAjusteEs = fatorAjusteSearchRepository.findOne(testFatorAjuste.getId());
        assertThat(fatorAjusteEs).isEqualToComparingFieldByField(testFatorAjuste);
    }

    @Test
    @Transactional
    public void createFatorAjusteWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = fatorAjusteRepository.findAll().size();

        // Create the FatorAjuste with an existing ID
        FatorAjuste existingFatorAjuste = new FatorAjuste();
        existingFatorAjuste.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restFatorAjusteMockMvc.perform(post("/api/fator-ajustes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingFatorAjuste)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<FatorAjuste> fatorAjusteList = fatorAjusteRepository.findAll();
        assertThat(fatorAjusteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = fatorAjusteRepository.findAll().size();
        // set the field null
        fatorAjuste.setNome(null);

        // Create the FatorAjuste, which fails.

        restFatorAjusteMockMvc.perform(post("/api/fator-ajustes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fatorAjuste)))
            .andExpect(status().isBadRequest());

        List<FatorAjuste> fatorAjusteList = fatorAjusteRepository.findAll();
        assertThat(fatorAjusteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkFatorIsRequired() throws Exception {
        int databaseSizeBeforeTest = fatorAjusteRepository.findAll().size();
        // set the field null
        fatorAjuste.setFator(null);

        // Create the FatorAjuste, which fails.

        restFatorAjusteMockMvc.perform(post("/api/fator-ajustes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fatorAjuste)))
            .andExpect(status().isBadRequest());

        List<FatorAjuste> fatorAjusteList = fatorAjusteRepository.findAll();
        assertThat(fatorAjusteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAtivoIsRequired() throws Exception {
        int databaseSizeBeforeTest = fatorAjusteRepository.findAll().size();
        // set the field null
        fatorAjuste.setAtivo(null);

        // Create the FatorAjuste, which fails.

        restFatorAjusteMockMvc.perform(post("/api/fator-ajustes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fatorAjuste)))
            .andExpect(status().isBadRequest());

        List<FatorAjuste> fatorAjusteList = fatorAjusteRepository.findAll();
        assertThat(fatorAjusteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllFatorAjustes() throws Exception {
        // Initialize the database
        fatorAjusteRepository.saveAndFlush(fatorAjuste);

        // Get all the fatorAjusteList
        restFatorAjusteMockMvc.perform(get("/api/fator-ajustes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fatorAjuste.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
            .andExpect(jsonPath("$.[*].fator").value(hasItem(DEFAULT_FATOR.intValue())))
            .andExpect(jsonPath("$.[*].ativo").value(hasItem(DEFAULT_ATIVO.booleanValue())))
            .andExpect(jsonPath("$.[*].tipoAjuste").value(hasItem(DEFAULT_TIPO_AJUSTE.toString())))
            .andExpect(jsonPath("$.[*].impacto").value(hasItem(DEFAULT_IMPACTO.toString())));
    }

    @Test
    @Transactional
    public void getFatorAjuste() throws Exception {
        // Initialize the database
        fatorAjusteRepository.saveAndFlush(fatorAjuste);

        // Get the fatorAjuste
        restFatorAjusteMockMvc.perform(get("/api/fator-ajustes/{id}", fatorAjuste.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(fatorAjuste.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()))
            .andExpect(jsonPath("$.fator").value(DEFAULT_FATOR.intValue()))
            .andExpect(jsonPath("$.ativo").value(DEFAULT_ATIVO.booleanValue()))
            .andExpect(jsonPath("$.tipoAjuste").value(DEFAULT_TIPO_AJUSTE.toString()))
            .andExpect(jsonPath("$.impacto").value(DEFAULT_IMPACTO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingFatorAjuste() throws Exception {
        // Get the fatorAjuste
        restFatorAjusteMockMvc.perform(get("/api/fator-ajustes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFatorAjuste() throws Exception {
        // Initialize the database
        fatorAjusteRepository.saveAndFlush(fatorAjuste);
        fatorAjusteSearchRepository.save(fatorAjuste);
        int databaseSizeBeforeUpdate = fatorAjusteRepository.findAll().size();

        // Update the fatorAjuste
        FatorAjuste updatedFatorAjuste = fatorAjusteRepository.findOne(fatorAjuste.getId());
        updatedFatorAjuste
                .nome(UPDATED_NOME)
                .fator(UPDATED_FATOR)
                .ativo(UPDATED_ATIVO)
                .tipoAjuste(UPDATED_TIPO_AJUSTE)
                .impacto(UPDATED_IMPACTO);

        restFatorAjusteMockMvc.perform(put("/api/fator-ajustes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedFatorAjuste)))
            .andExpect(status().isOk());

        // Validate the FatorAjuste in the database
        List<FatorAjuste> fatorAjusteList = fatorAjusteRepository.findAll();
        assertThat(fatorAjusteList).hasSize(databaseSizeBeforeUpdate);
        FatorAjuste testFatorAjuste = fatorAjusteList.get(fatorAjusteList.size() - 1);
        assertThat(testFatorAjuste.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testFatorAjuste.getFator()).isEqualTo(UPDATED_FATOR);
        assertThat(testFatorAjuste.isAtivo()).isEqualTo(UPDATED_ATIVO);
        assertThat(testFatorAjuste.getTipoAjuste()).isEqualTo(UPDATED_TIPO_AJUSTE);
        assertThat(testFatorAjuste.getImpacto()).isEqualTo(UPDATED_IMPACTO);

        // Validate the FatorAjuste in Elasticsearch
        FatorAjuste fatorAjusteEs = fatorAjusteSearchRepository.findOne(testFatorAjuste.getId());
        assertThat(fatorAjusteEs).isEqualToComparingFieldByField(testFatorAjuste);
    }

    @Test
    @Transactional
    public void updateNonExistingFatorAjuste() throws Exception {
        int databaseSizeBeforeUpdate = fatorAjusteRepository.findAll().size();

        // Create the FatorAjuste

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restFatorAjusteMockMvc.perform(put("/api/fator-ajustes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(fatorAjuste)))
            .andExpect(status().isCreated());

        // Validate the FatorAjuste in the database
        List<FatorAjuste> fatorAjusteList = fatorAjusteRepository.findAll();
        assertThat(fatorAjusteList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteFatorAjuste() throws Exception {
        // Initialize the database
        fatorAjusteRepository.saveAndFlush(fatorAjuste);
        fatorAjusteSearchRepository.save(fatorAjuste);
        int databaseSizeBeforeDelete = fatorAjusteRepository.findAll().size();

        // Get the fatorAjuste
        restFatorAjusteMockMvc.perform(delete("/api/fator-ajustes/{id}", fatorAjuste.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean fatorAjusteExistsInEs = fatorAjusteSearchRepository.exists(fatorAjuste.getId());
        assertThat(fatorAjusteExistsInEs).isFalse();

        // Validate the database is empty
        List<FatorAjuste> fatorAjusteList = fatorAjusteRepository.findAll();
        assertThat(fatorAjusteList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchFatorAjuste() throws Exception {
        // Initialize the database
        fatorAjusteRepository.saveAndFlush(fatorAjuste);
        fatorAjusteSearchRepository.save(fatorAjuste);

        // Search the fatorAjuste
        restFatorAjusteMockMvc.perform(get("/api/_search/fator-ajustes?query=id:" + fatorAjuste.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(fatorAjuste.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
            .andExpect(jsonPath("$.[*].fator").value(hasItem(DEFAULT_FATOR.intValue())))
            .andExpect(jsonPath("$.[*].ativo").value(hasItem(DEFAULT_ATIVO.booleanValue())))
            .andExpect(jsonPath("$.[*].tipoAjuste").value(hasItem(DEFAULT_TIPO_AJUSTE.toString())))
            .andExpect(jsonPath("$.[*].impacto").value(hasItem(DEFAULT_IMPACTO.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FatorAjuste.class);
    }
}
