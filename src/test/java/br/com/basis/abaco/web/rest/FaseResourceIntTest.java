package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.AbacoApp;
import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.domain.Fase;
import br.com.basis.abaco.repository.FaseRepository;
import br.com.basis.abaco.service.FaseService;
import br.com.basis.abaco.service.dto.FaseDTO;
import br.com.basis.abaco.service.dto.filtro.FaseFiltroDTO;
import br.com.basis.abaco.utils.CustomPageImpl;
import br.com.basis.abaco.web.rest.errors.ExceptionTranslator;
import com.fasterxml.jackson.core.type.TypeReference;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.ResourceHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = AbacoApp.class)
@Transactional
@WithMockUser
public class FaseResourceIntTest {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    @Autowired
    private FaseService faseService;
    
    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private FaseRepository repository;
    
    @Autowired
    private EsforcoFaseResource esforcoFaseResource;

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

    public static FaseDTO createFase() {
        FaseDTO fase = new FaseDTO();
        fase.setNome(DEFAULT_NOME);
        return fase;
    }

    public void postDTO(FaseDTO dto) throws Exception {
        restFaseMockMvc.perform(post(RESOURCE)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dto))).andExpect(status().isOk());
    }

    public FaseDTO getDTO(Long id) throws Exception {
        return jacksonMessageConverter.getObjectMapper().readValue(
            restFaseMockMvc.perform(
                get(RESOURCE + "/" + id)
            ).andExpect(status().isOk()).andReturn().getResponse().getContentAsString()
        , FaseDTO.class);
    }
    
    public FaseDTO persistFaseDTO() throws Exception {
        postDTO(createFase());
        FaseFiltroDTO filtro = new FaseFiltroDTO();
    
        Page<FaseDTO> fases = findPage(filtro);
    
        return fases.getContent().get(0);
    }
    
    private Page<FaseDTO> findPage(FaseFiltroDTO filtro) throws Exception {
        return jacksonMessageConverter.getObjectMapper().readValue(
            restFaseMockMvc.perform(
                post(API + "search/fases")
                    .contentType(TestUtil.APPLICATION_JSON_UTF8)
                    .content(TestUtil.convertObjectToJsonBytes(filtro))
            ).andExpect(status().isOk()).andReturn().getResponse().getContentAsString()
            , new TypeReference<CustomPageImpl<FaseDTO>>() {
            });
    }
    
    @Test
    public void createAndFind() throws Exception {

        FaseDTO dto = createFase();

        postDTO(dto);

        FaseFiltroDTO filtro = new FaseFiltroDTO();
    
        Page<FaseDTO> fases = findPage(filtro);
    
        dto = fases.getContent().get(0);

        dto = getDTO(dto.getId());

        assertNotNull(dto);
        assertNotNull(dto.getId());
        assertNotNull(dto.getNome());
    }

    @Test
    public void createWithExeption() throws Exception {
        FaseDTO dto = persistFaseDTO();
        dto.setId(null);
        restFaseMockMvc.perform(post(RESOURCE)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dto)))
            .andExpect(status().isBadRequest());

        restFaseMockMvc.perform(
            post(RESOURCE).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dto))
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void edit() throws Exception {
        FaseDTO dto = persistFaseDTO();
        assertNotNull(dto.getId());

        dto.setNome(UPDATED_NOME);

        restFaseMockMvc.perform(
            post(RESOURCE).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dto))
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
        FaseDTO dto = persistFaseDTO();

        restFaseMockMvc.perform(delete(RESOURCE + "/{id}", dto.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        restFaseMockMvc.perform(get(RESOURCE + "/{id}", dto.getId()))
            .andExpect(status().isNotFound());
    }

    @Test
    public void deleteFaseWithExeption() throws Exception {
        FaseDTO faseDTO = persistFaseDTO();

        // TODO REMOVER MOCK QUANDO ESFORÇO FASE ESTIVER INTEGRADA CORRETAMENTE
        EsforcoFase esforcoFase = new EsforcoFase();
        esforcoFase.setEsforco(new BigDecimal(10));
    
        // TODO Necessario pois o existem duas entidades fase, adaptar quando Esforço Fase for refeito
        Fase fase = new Fase();
        fase.setId(faseDTO.getId());
        fase.setNome(faseDTO.getNome());
        
        esforcoFase.setFase(fase);
        
        esforcoFaseResource.createEsforcoFase(esforcoFase);
        
        restFaseMockMvc.perform(delete(RESOURCE + "/{id}", faseDTO.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isBadRequest());
    }

    @Test
    public void searchFase() throws Exception {
        FaseDTO dto = persistFaseDTO();

        FaseDTO dto2 = new FaseDTO();
        dto2.setNome(UPDATED_NOME);
        postDTO(dto2);

        FaseFiltroDTO filtro = new FaseFiltroDTO();

        restFaseMockMvc.perform(
                post(API + "search/fases")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(filtro))
            )
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.totalElements").value(2))
            .andExpect(jsonPath("$.content.[*].id").value(hasItem(dto.getId().intValue())))
            .andExpect(jsonPath("$.content.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.content.[*].nome").value(hasItem(UPDATED_NOME)));
    }

    @Test
    public void searchFaseFiltered() throws Exception {
        FaseDTO dto = persistFaseDTO();

        FaseDTO dto2 = new FaseDTO();
        dto2.setNome(UPDATED_NOME);
        postDTO(dto2);

        FaseFiltroDTO filtro = new FaseFiltroDTO();
        filtro.setNome(DEFAULT_NOME);

        restFaseMockMvc.perform(
            post(API + "search/fases")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(filtro))
        )
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.totalElements").value(1))
            .andExpect(jsonPath("$.content.[*].id").value(hasItem(dto.getId().intValue())))
            .andExpect(jsonPath("$.content.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    public void getFases() throws Exception {
        postDTO(createFase());

        FaseDTO dto2 = createFase();
        dto2.setNome(UPDATED_NOME);
        postDTO(dto2);
    
        FaseFiltroDTO filtro = new FaseFiltroDTO();
    
        restFaseMockMvc.perform(
            post(API + "search/fases")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(filtro))
        ).andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
        .andExpect(jsonPath("$.totalElements", equalTo(2)))
        .andExpect(jsonPath("$.content.[*].nome").value(hasItem(DEFAULT_NOME)))
        .andExpect(jsonPath("$.content.[*].nome").value(hasItem(UPDATED_NOME)));
    }

    @Test
    public void geenrateReport() throws Exception {
        postDTO(createFase());

        FaseFiltroDTO filtro = new FaseFiltroDTO();
        
        filtro.setNome(DEFAULT_NOME);
        
        restFaseMockMvc.perform(
                post(RESOURCE + "/exportacao/pdf")
                    .contentType(TestUtil.APPLICATION_JSON_UTF8)
                    .content(TestUtil.convertObjectToJsonBytes(filtro))
            ).andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_OCTET_STREAM_VALUE));
    }

}
