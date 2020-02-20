package br.com.basis.abaco.service.mapper;

import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.domain.Analise;
import br.com.basis.abaco.domain.Sistema;
import br.com.basis.abaco.domain.TipoEquipe;
import br.com.basis.abaco.domain.Organizacao;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.data.elasticsearch.core.DefaultEntityMapper;

import java.io.IOException;
import java.util.*;

public class AnaliseEntityMapper extends DefaultEntityMapper {

    private ObjectMapper mapper = new ObjectMapper();

    @Override
    public <T> T mapToObject(String source, Class<T> clazz) throws IOException {
        Analise retorno = (Analise) super.mapToObject(source, clazz);
        final ObjectNode node = mapper.readValue(source, ObjectNode.class);
        JsonNode user = node.get("users.firstName");
        Set<User> users = new HashSet<>();
        if (Optional.ofNullable(user).isPresent() && user.isArray()) {
            for (Object userName : mapper.convertValue(users, ArrayList.class)) {
                users.add(newUser(userName.toString()));
            }
        } else {
            users.add(newUser(user.textValue()));
        }
        retorno.setUsers(users);
        retorno.setSistema(Sistema.builder().nome(node.get("sistema.nome").textValue()).build());
        retorno.setEquipeResponsavel(TipoEquipe.builder().nome(node.get("equipeResponsavel.nome").textValue()).build());
        retorno.setOrganizacao(Organizacao.builder().nome(node.get("organizacao.nome").textValue()).build());
        return (T) retorno;
    }

    private User newUser(String firstName) {
        return User.builder()
            .firstName(firstName)
            .authorities(Collections.emptySet())
            .tipoEquipes(Collections.emptySet())
            .analises(Collections.emptySet())
            .organizacoes(Collections.emptySet())
            .build();
    }

}
