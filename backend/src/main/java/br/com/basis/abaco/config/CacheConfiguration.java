package br.com.basis.abaco.config;

import io.github.jhipster.config.JHipsterProperties;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.expiry.Duration;
import org.ehcache.expiry.Expirations;
import org.ehcache.jsr107.Eh107Configuration;
import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.cache.CacheManager;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
@AutoConfigureAfter(value = {MetricsConfiguration.class})
@AutoConfigureBefore(value = {WebConfigurer.class, DatabaseConfiguration.class})
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;
    private static final String FUNCIONALDIADES = ".funcionalidades";

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(Expirations.timeToLiveExpiration(Duration.of(ehcache.getTimeToLiveSeconds(), TimeUnit.SECONDS)))
                .build());
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            // Este método foi separado para atender ao limite de linhas de um método do SonarQube
            configureCache(cm);
            configureCachePartTwo(cm);
        };
    }

    private void configureCachePartTwo(CacheManager cm) {
        cm.createCache(br.com.basis.abaco.domain.Rlr.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Rlr.class.getName() + ".ders", jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Der.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.EsforcoFase.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Fase.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Contrato.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.FuncaoDados.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.FuncaoDados.class.getName() + FUNCIONALDIADES, jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.FuncaoDados.class.getName() + ".rlrs", jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.FuncaoTransacao.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.FuncaoTransacao.class.getName() + FUNCIONALDIADES, jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.FuncaoTransacao.class.getName() + ".alrs", jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Alr.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Alr.class.getName() + ".funcaoDados", jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.TipoEquipe.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.BaseLineSintetico.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.BaseLineAnalitico.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Grupo.class.getName(), jcacheConfiguration);
        // jhipster-needle-ehcache-add-entry
    }

    private void configureCache(CacheManager cm) {
        cm.createCache(br.com.basis.abaco.domain.FatorAjuste.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.User.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Perfil.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.User.class.getName() + ".authorities", jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.SocialUserConnection.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Organizacao.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Organizacao.class.getName() + ".sistemas", jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Manual.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Manual.class.getName() + ".esforcoFases", jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Sistema.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Sistema.class.getName() + ".modulos", jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Modulo.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Modulo.class.getName() + FUNCIONALDIADES, jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Funcionalidade.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Analise.class.getName(), jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Analise.class.getName() + ".funcaoDados", jcacheConfiguration);
        cm.createCache(br.com.basis.abaco.domain.Analise.class.getName() + ".funcaoTransacaos", jcacheConfiguration);
    }
}
