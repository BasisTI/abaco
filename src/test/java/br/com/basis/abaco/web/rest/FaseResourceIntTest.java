package br.com.basis.abaco.web.rest;

import br.com.basis.abaco.AbacoApp;
import br.com.basis.abaco.domain.EsforcoFase;
import br.com.basis.abaco.domain.Fase;
import br.com.basis.abaco.repository.FaseRepository;
import br.com.basis.abaco.service.FaseService;
import br.com.basis.abaco.service.dto.FaseDTO;
import br.com.basis.abaco.service.dto.filter.FaseFiltroDTO;
import br.com.basis.abaco.utils.CustomPageImpl;
import br.com.basis.abaco.web.rest.errors.ExceptionTranslator;
import com.fasterxml.jackson.core.type.TypeReference;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.ResourceHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.math.BigDecimal;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
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
    private FaseService service;
    
    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private FaseRepository repository;
    
    @Autowired
    private EsforcoFaseResource esforcoFaseResource;

    private MockMvc mockMvc;

    private static final String RESOURCE = "/api/fases";
    
    private static final String RESOURCE_PAGE = "/api/fases/page";

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            FaseResource faseResource = new FaseResource(service);
        this.mockMvc = MockMvcBuilders.standaloneSetup(faseResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter, new ResourceHttpMessageConverter()).build();
    }

    public static FaseDTO buildDTO() {
        FaseDTO fase = new FaseDTO();
        fase.setNome(DEFAULT_NOME);
        return fase;
    }

    public void postDTO(FaseDTO dto) throws Exception {
        mockMvc.perform(post(RESOURCE)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dto))).andExpect(status().isOk());
    }

    public FaseDTO getDTO(Long id) throws Exception {
        return jacksonMessageConverter.getObjectMapper().readValue(
            mockMvc.perform(
                get(RESOURCE + "/" + id)
            ).andExpect(status().isOk()).andReturn().getResponse().getContentAsString()
        , FaseDTO.class);
    }
    
    public FaseDTO persistDTO() throws Exception {
        postDTO(buildDTO());
        FaseFiltroDTO filtro = new FaseFiltroDTO();
    
        Page<FaseDTO> fases = findPage(filtro);
    
        return fases.getContent().get(0);
    }
    
    private Page<FaseDTO> findPage(FaseFiltroDTO filtro) throws Exception {
        return jacksonMessageConverter.getObjectMapper().readValue(
            mockMvc.perform(
                post(RESOURCE_PAGE)
                    .contentType(TestUtil.APPLICATION_JSON_UTF8)
                    .content(TestUtil.convertObjectToJsonBytes(filtro))
            ).andExpect(status().isOk()).andReturn().getResponse().getContentAsString()
            , new TypeReference<CustomPageImpl<FaseDTO>>() {
            });
    }
    
    @Test
    public void createAndFind() throws Exception {

        FaseDTO dto = buildDTO();

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
        FaseDTO dto = persistDTO();
        dto.setId(null);
        mockMvc.perform(post(RESOURCE)
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(dto)))
            .andExpect(status().isBadRequest());

        mockMvc.perform(
            post(RESOURCE).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dto))
        ).andExpect(status().isBadRequest());
    }

    @Test
    public void edit() throws Exception {
        FaseDTO dto = persistDTO();
        assertNotNull(dto.getId());

        dto.setNome(UPDATED_NOME);

        mockMvc.perform(
            post(RESOURCE).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(dto))
        ).andExpect(status().isOk());

        dto = getDTO(dto.getId());

        assertEquals(UPDATED_NOME, dto.getNome());
    }

    @Test
    public void getNonExistingFase() throws Exception {
        mockMvc.perform(get(RESOURCE + "/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void delete() throws Exception {
        FaseDTO dto = persistDTO();

        mockMvc.perform(MockMvcRequestBuilders.delete(RESOURCE + "/{id}", dto.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        mockMvc.perform(get(RESOURCE + "/{id}", dto.getId()))
            .andExpect(status().isNotFound());
    }

    @Test
    public void deleteWithExeption() throws Exception {
        FaseDTO faseDTO = persistDTO();

        // TODO REMOVER MOCK QUANDO ESFORÇO FASE ESTIVER INTEGRADA CORRETAMENTE
        EsforcoFase esforcoFase = new EsforcoFase();
        esforcoFase.setEsforco(new BigDecimal(10));
    
        // TODO Necessario pois o existem duas entidades fase, adaptar quando Esforço Fase for refeito
        Fase fase = new Fase();
        fase.setId(faseDTO.getId());
        fase.setNome(faseDTO.getNome());
        
        esforcoFase.setFase(fase);
        
        esforcoFaseResource.createEsforcoFase(esforcoFase);
        
        mockMvc.perform(MockMvcRequestBuilders.delete(RESOURCE + "/{id}", faseDTO.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isBadRequest());
    }

    @Test
    public void search() throws Exception {
        FaseDTO dto = persistDTO();

        FaseDTO dto2 = new FaseDTO();
        dto2.setNome(UPDATED_NOME);
        postDTO(dto2);

        FaseFiltroDTO filtro = new FaseFiltroDTO();

        mockMvc.perform(
                post(RESOURCE_PAGE)
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
    public void getDropdown() throws Exception {
        postDTO(buildDTO());
    
        FaseDTO faseDTO2 = buildDTO();
        faseDTO2.setNome(UPDATED_NOME);
        postDTO(faseDTO2);
    
        mockMvc.perform(
                get(RESOURCE + "/dropdown")
            ).andExpect(status().isOk())
            .andExpect(jsonPath("$", Matchers.hasSize(2)))
            .andExpect(jsonPath("$[*].id", everyItem(is(notNullValue()))))
            .andExpect(jsonPath("$[*].label").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    public void searchFiltered() throws Exception {
        FaseDTO dto = persistDTO();

        FaseDTO dto2 = new FaseDTO();
        dto2.setNome(UPDATED_NOME);
        postDTO(dto2);

        FaseFiltroDTO filtro = new FaseFiltroDTO();
        filtro.setNome(DEFAULT_NOME);

        mockMvc.perform(
            post(RESOURCE_PAGE)
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
    public void getDTO() throws Exception {
        postDTO(buildDTO());

        FaseDTO dto2 = buildDTO();
        dto2.setNome(UPDATED_NOME);
        postDTO(dto2);
    
        FaseFiltroDTO filtro = new FaseFiltroDTO();
    
        mockMvc.perform(
            post(RESOURCE_PAGE)
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
        postDTO(buildDTO());

        FaseFiltroDTO filtro = new FaseFiltroDTO();
        
        filtro.setNome(DEFAULT_NOME);
        
        mockMvc.perform(
                post(RESOURCE + "/exportacao/pdf")
                    .contentType(TestUtil.APPLICATION_JSON_UTF8)
                    .content(TestUtil.convertObjectToJsonBytes(filtro))
            ).andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_OCTET_STREAM_VALUE));
    }

}
