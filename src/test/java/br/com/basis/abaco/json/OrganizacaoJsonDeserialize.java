package br.com.basis.abaco.json;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.util.Set;

import org.junit.BeforeClass;
import org.junit.Test;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.basis.abaco.domain.Contrato;
import br.com.basis.abaco.domain.Organizacao;

public class OrganizacaoJsonDeserialize {

	// @formatter:off
	private static String input = "{\n" + 
			"    \"nome\": \"org a\",\n" + 
			"    \"cnpj\": \"40.742.513/0001-92\",\n" + 
			"    \"ativo\": true,\n" + 
			"    \"numeroOcorrencia\": \"123\",\n" + 
			"    \"contracts\": [\n" + 
			"        {\n" + 
			"            \"numeroContrato\": \"c 1\",\n" + 
			"            \"dataInicioVigencia\": \"2017-12-06T02:00:00.000Z\",\n" + 
			"            \"dataFimVigencia\": \"2017-12-14T02:00:00.000Z\",\n" + 
			"            \"manual\": {\n" + 
			"                \"id\": 1351,\n" + 
			"                \"nome\": \"Teste Manual\",\n" + 
			"                \"observacao\": \"obs manual\",\n" + 
			"                \"valorVariacaoEstimada\": 1,\n" + 
			"                \"valorVariacaoIndicativa\": 0,\n" + 
			"                \"arquivoManualContentType\": null,\n" + 
			"                \"arquivoManual\": null\n" + 
			"            },\n" + 
			"            \"ativo\": true\n" + 
			"        },\n" + 
			"        {\n" + 
			"            \"numeroContrato\": \"c 3\",\n" + 
			"            \"dataInicioVigencia\": \"2017-12-09T02:00:00.000Z\",\n" + 
			"            \"dataFimVigencia\": \"2017-12-29T02:00:00.000Z\",\n" + 
			"            \"manual\": {\n" + 
			"                \"id\": 1351,\n" + 
			"                \"nome\": \"Teste Manual\",\n" + 
			"                \"observacao\": \"obs manual\",\n" + 
			"                \"valorVariacaoEstimada\": 1,\n" + 
			"                \"valorVariacaoIndicativa\": 0,\n" + 
			"                \"arquivoManualContentType\": null,\n" + 
			"                \"arquivoManual\": null\n" + 
			"            },\n" + 
			"            \"ativo\": true\n" + 
			"        }\n" + 
			"    ]\n" + 
			"}";
	// @formatter:on

	private static Organizacao organizacaoDeserialized;

	@BeforeClass
	public static void setUpAll() throws JsonParseException, JsonMappingException, IOException {
		organizacaoDeserialized = new ObjectMapper().readValue(input.getBytes(), Organizacao.class);
	}

	@Test
	public void contratosShouldNotBeEmpty() throws JsonParseException, JsonMappingException, IOException {
		assertFalse(organizacaoDeserialized.getContracts().isEmpty());
	}

	@Test
	public void eachContratoShouldBeProperlyDeserialized() {
		Set<Contrato> contratos = organizacaoDeserialized.getContracts();
		contratos.forEach(c -> {
			assertNotNull(c.getDataInicioVigencia());
			assertNotNull(c.getDataFimVigencia());
			assertStringNotEmpty(c.getNumeroContrato());
			assertNotNull(c.getOrganization());
		});
	}

	private void assertStringNotEmpty(String s) {
		assertNotNull(s);
		assertFalse(s.isEmpty());
	}
}
