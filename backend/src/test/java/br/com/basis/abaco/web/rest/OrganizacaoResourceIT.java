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

import br.com.basis.abaco.repository.UploadedFilesRepository;
import br.com.basis.abaco.service.PerfilService;
import br.com.basis.abaco.service.UserService;
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
import br.com.basis.abaco.domain.Organizacao;
import br.com.basis.abaco.repository.OrganizacaoRepository;
import br.com.basis.abaco.repository.search.OrganizacaoSearchRepository;
import br.com.basis.abaco.service.OrganizacaoService;
import br.com.basis.abaco.web.rest.errors.ExceptionTranslator;
import br.com.basis.dynamicexports.service.DynamicExportsService;

/**
 * Test class for the OrganizacaoResource REST controller.
 *
 * @see OrganizacaoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
public class OrganizacaoResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_CNPJ = "72I914&661/2018-33";
    private static final String UPDATED_CNPJ = "94145885303146";

    private static final Boolean DEFAULT_ATIVO = false;
    private static final Boolean UPDATED_ATIVO = true;

    private static final String DEFAULT_NUMERO_OCORRENCIA = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO_OCORRENCIA = "BBBBBBBBBB";

    @Autowired
    private OrganizacaoRepository organizacaoRepository;

    @Autowired
    private OrganizacaoSearchRepository organizacaoSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private DynamicExportsService dynamicExportsService;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private OrganizacaoService organizacaoService;

    @Autowired
    private EntityManager em;

    private MockMvc restOrganizacaoMockMvc;

    private Organizacao organizacao;

    private PerfilService perfilService;

    @Autowired
    private UploadedFilesRepository filesRepository;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        OrganizacaoResource organizacaoResource = new OrganizacaoResource(organizacaoRepository,
                organizacaoSearchRepository, filesRepository, dynamicExportsService, organizacaoService, perfilService);
        this.restOrganizacaoMockMvc = MockMvcBuilders.standaloneSetup(organizacaoResource)
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
    public static Organizacao createEntity(EntityManager em) {
        Organizacao organizacao = new Organizacao()
                .nome(DEFAULT_NOME)
                .cnpj(DEFAULT_CNPJ)
                .ativo(DEFAULT_ATIVO)
                .numeroOcorrencia(DEFAULT_NUMERO_OCORRENCIA);
        return organizacao;
    }

    @Before
    public void initTest() {
        organizacaoSearchRepository.deleteAll();
        organizacao = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrganizacao() throws Exception {
        int databaseSizeBeforeCreate = organizacaoRepository.findAll().size();

        // Create the Organizacao

        restOrganizacaoMockMvc.perform(post("/api/organizacaos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(organizacao)))
            .andExpect(status().isCreated());

        // Validate the Organizacao in the database
        List<Organizacao> organizacaoList = organizacaoRepository.findAll();
        assertThat(organizacaoList).hasSize(databaseSizeBeforeCreate + 1);
        Organizacao testOrganizacao = organizacaoList.get(organizacaoList.size() - 1);
        assertThat(testOrganizacao.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testOrganizacao.getCnpj()).isEqualTo(DEFAULT_CNPJ);
        assertThat(testOrganizacao.getAtivo()).isEqualTo(DEFAULT_ATIVO);
        assertThat(testOrganizacao.getNumeroOcorrencia()).isEqualTo(DEFAULT_NUMERO_OCORRENCIA);

        // Validate the Organizacao in Elasticsearch
        Organizacao organizacaoEs = organizacaoSearchRepository.findOne(testOrganizacao.getId());
        assertThat(organizacaoEs).isEqualToComparingFieldByField(testOrganizacao);
    }

    @Test
    @Transactional
    public void createOrganizacaoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = organizacaoRepository.findAll().size();

        // Create the Organizacao with an existing ID
        Organizacao existingOrganizacao = new Organizacao();
        existingOrganizacao.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrganizacaoMockMvc.perform(post("/api/organizacaos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingOrganizacao)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Organizacao> organizacaoList = organizacaoRepository.findAll();
        assertThat(organizacaoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkAtivoIsRequired() throws Exception {
        int databaseSizeBeforeTest = organizacaoRepository.findAll().size();
        // set the field null
        organizacao.setAtivo(null);

        // Create the Organizacao, which fails.

        restOrganizacaoMockMvc.perform(post("/api/organizacaos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(organizacao)))
            .andExpect(status().isBadRequest());

        List<Organizacao> organizacaoList = organizacaoRepository.findAll();
        assertThat(organizacaoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOrganizacaos() throws Exception {
        // Initialize the database
        organizacaoRepository.saveAndFlush(organizacao);

        // Get all the organizacaoList
        restOrganizacaoMockMvc.perform(get("/api/organizacaos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(organizacao.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
            .andExpect(jsonPath("$.[*].cnpj").value(hasItem(DEFAULT_CNPJ.toString())))
            .andExpect(jsonPath("$.[*].ativo").value(hasItem(DEFAULT_ATIVO.booleanValue())))
            .andExpect(jsonPath("$.[*].numeroOcorrencia").value(hasItem(DEFAULT_NUMERO_OCORRENCIA.toString())));
    }

    @Test
    @Transactional
    public void getOrganizacao() throws Exception {
        // Initialize the database
        organizacaoRepository.saveAndFlush(organizacao);

        // Get the organizacao
        restOrganizacaoMockMvc.perform(get("/api/organizacaos/{id}", organizacao.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(organizacao.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME.toString()))
            .andExpect(jsonPath("$.cnpj").value(DEFAULT_CNPJ.toString()))
            .andExpect(jsonPath("$.ativo").value(DEFAULT_ATIVO.booleanValue()))
            .andExpect(jsonPath("$.numeroOcorrencia").value(DEFAULT_NUMERO_OCORRENCIA.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingOrganizacao() throws Exception {
        // Get the organizacao
        restOrganizacaoMockMvc.perform(get("/api/organizacaos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOrganizacao() throws Exception {
        // Initialize the database
        organizacaoRepository.saveAndFlush(organizacao);
        organizacaoSearchRepository.save(organizacao);
        int databaseSizeBeforeUpdate = organizacaoRepository.findAll().size();

        // Update the organizacao
        Organizacao updatedOrganizacao = organizacaoRepository.findOne(organizacao.getId());
        updatedOrganizacao
                .nome(UPDATED_NOME)
                .cnpj(UPDATED_CNPJ)
                .ativo(UPDATED_ATIVO)
                .numeroOcorrencia(UPDATED_NUMERO_OCORRENCIA);

        restOrganizacaoMockMvc.perform(put("/api/organizacaos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedOrganizacao)))
            .andExpect(status().isOk());

        // Validate the Organizacao in the database
        List<Organizacao> organizacaoList = organizacaoRepository.findAll();
        assertThat(organizacaoList).hasSize(databaseSizeBeforeUpdate);
        Organizacao testOrganizacao = organizacaoList.get(organizacaoList.size() - 1);
        assertThat(testOrganizacao.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testOrganizacao.getCnpj()).isEqualTo(UPDATED_CNPJ);
        assertThat(testOrganizacao.getAtivo()).isEqualTo(UPDATED_ATIVO);
        assertThat(testOrganizacao.getNumeroOcorrencia()).isEqualTo(UPDATED_NUMERO_OCORRENCIA);

        // Validate the Organizacao in Elasticsearch
        Organizacao organizacaoEs = organizacaoSearchRepository.findOne(testOrganizacao.getId());
        assertThat(organizacaoEs).isEqualToComparingFieldByField(testOrganizacao);
    }

    @Test
    @Transactional
    public void updateNonExistingOrganizacao() throws Exception {
        int databaseSizeBeforeUpdate = organizacaoRepository.findAll().size();

        // Create the Organizacao

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restOrganizacaoMockMvc.perform(put("/api/organizacaos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(organizacao)))
            .andExpect(status().isCreated());

        // Validate the Organizacao in the database
        List<Organizacao> organizacaoList = organizacaoRepository.findAll();
        assertThat(organizacaoList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteOrganizacao() throws Exception {
        // Initialize the database
        organizacaoRepository.saveAndFlush(organizacao);
        organizacaoSearchRepository.save(organizacao);
        int databaseSizeBeforeDelete = organizacaoRepository.findAll().size();

        // Get the organizacao
        restOrganizacaoMockMvc.perform(delete("/api/organizacaos/{id}", organizacao.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean organizacaoExistsInEs = organizacaoSearchRepository.exists(organizacao.getId());
        assertThat(organizacaoExistsInEs).isFalse();

        // Validate the database is empty
        List<Organizacao> organizacaoList = organizacaoRepository.findAll();
        assertThat(organizacaoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchOrganizacao() throws Exception {
        // Initialize the database
        organizacaoRepository.saveAndFlush(organizacao);
        organizacaoSearchRepository.save(organizacao);

        // Search the organizacao
        restOrganizacaoMockMvc.perform(get("/api/_search/organizacaos?query=id:" + organizacao.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(organizacao.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME.toString())))
            .andExpect(jsonPath("$.[*].cnpj").value(hasItem(DEFAULT_CNPJ.toString())))
            .andExpect(jsonPath("$.[*].ativo").value(hasItem(DEFAULT_ATIVO.booleanValue())))
            .andExpect(jsonPath("$.[*].numeroOcorrencia").value(hasItem(DEFAULT_NUMERO_OCORRENCIA.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Organizacao.class);
    }
}
