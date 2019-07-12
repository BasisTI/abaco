package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.AbacoApp;
import br.com.basis.abaco.domain.Fase;
import br.com.basis.abaco.service.EsforcoFaseService;
import br.com.basis.abaco.service.FaseService;
import br.com.basis.abaco.service.dto.EsforcoFaseDTO;
import br.com.basis.abaco.service.dto.FaseDTO;
import br.com.basis.abaco.web.rest.errors.ExceptionTranslator;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.ResourceHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Test class for the FaseResource REST controller.
 *
 * @see FaseResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
@Transactional
public class FaseResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private FaseService faseService;

    @Autowired
    private EsforcoFaseService esforcoFaseService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restFaseMockMvc;

    private static final String API = "/api/";

    private static final String RESOURCE = API + "fases";

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            FaseResource faseResource = new FaseResource(faseService);
        this.restFaseMockMvc = MockMvcBuilders.standaloneSetup(faseResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter, new ResourceHttpMessageConverter()).build();
    }

    public static FaseDTO createEntity() {
        FaseDTO fase = new FaseDTO();
        fase.setNome(DEFAULT_NOME);
        return fase;
    }


    public FaseDTO postDTO(FaseDTO dto) throws Exception {
        return jacksonMessageConverter.getObjectMapper().readValue(
            restFaseMockMvc.perform(post(RESOURCE)
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(dto)))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString()
            , FaseDTO.class);

    }

    public FaseDTO getDTO(Long id) throws Exception {
        return jacksonMessageConverter.getObjectMapper().readValue(
            restFaseMockMvc.perform(
                get(RESOURCE + "/" + id)
            ).andExpect(status().isOk()).andReturn().getResponse().getContentAsString()
        , FaseDTO.class);
    }

    @Test
    public void createAndFind() throws Exception {
        FaseDTO dto = postDTO(createEntity());
        assertNotNull(dto.getId());

        dto = getDTO(dto.getId());

        assertNotNull(dto);
        assertNotNull(dto.getId());
        assertNotNull(dto.getNome());
    }

    @Test
    public void createWithExeption() throws Exception {
        FaseDTO dto = postDTO(createEntity());
        dto.setId(null);
        restFaseMockMvc.perform(post(RESOURCE)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dto)))
            .andExpect(status().isBadRequest());

        restFaseMockMvc.perform(
            put(RESOURCE).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dto))
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void edit() throws Exception {
        FaseDTO dto = postDTO(createEntity());
        assertNotNull(dto.getId());

        dto.setNome(UPDATED_NOME);

        restFaseMockMvc.perform(
            put(RESOURCE).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dto))
        ).andExpect(status().isOk());

        dto = getDTO(dto.getId());

        assertEquals(UPDATED_NOME, dto.getNome());
    }

    @Test
    public void getNonExistingFase() throws Exception {
        restFaseMockMvc.perform(get(RESOURCE + "/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void deleteFase() throws Exception {
        FaseDTO dto = postDTO(createEntity());

        restFaseMockMvc.perform(delete(RESOURCE + "/{id}", dto.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        restFaseMockMvc.perform(get(RESOURCE + "/{id}", dto.getId()))
            .andExpect(status().isNotFound());
    }

    @Test public void deleteFaseWithExeption() {
        EsforcoFaseDTO esforcoFaseDTO = new EsforcoFaseDTO();
        FaseDTO faseDTO = createEntity();
        esforcoFaseDTO.setFase(faseDTO);

        esforcoFaseService
    }

    @Test
    public void searchFase() throws Exception {
        FaseDTO dto = postDTO(createEntity());

        restFaseMockMvc.perform(get(API + "_search/fases"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dto.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    public void getFases() throws Exception {
        postDTO(createEntity());

        FaseDTO dto2 = createEntity();
        dto2.setNome(UPDATED_NOME);
        postDTO(dto2);

        restFaseMockMvc.perform(get(RESOURCE)).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
        .andExpect(jsonPath("$.[*].nome").value(hasItem(UPDATED_NOME)));
    }

    @Test
    public void getRelatorio() throws Exception {
        postDTO(createEntity());

        restFaseMockMvc.perform(
                get(API + "/tipoFase/exportacao/pdf?query=**")
            ).andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_OCTET_STREAM_VALUE));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Fase.class);
    }
}
