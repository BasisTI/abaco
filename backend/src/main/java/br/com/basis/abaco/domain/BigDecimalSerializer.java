package br.com.basis.abaco.domain;

import br.com.basis.abaco.utils.BigDecimalUtils;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.math.BigDecimal;

public class BigDecimalSerializer extends JsonDeserializer<BigDecimal> {

    @Override
    public BigDecimal deserialize(JsonParser jsonParser, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {
        JsonToken currentToken = jsonParser.getCurrentToken();
        if (currentToken.isNumeric()) {
            String value = jsonParser.getText();
            return convertToAtLeastOneFixedPoint(value);
        }
        return (BigDecimal) ctxt.handleUnexpectedToken(BigDecimal.class, jsonParser);
    }

    private BigDecimal convertToAtLeastOneFixedPoint(String value) {
        BigDecimal bigDecimalValue = new BigDecimal(value);
        return BigDecimalUtils.toAtLeastOneFixedPoint(bigDecimalValue);
    }

}
