package br.com.basis.abaco.utils;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;

import org.junit.Test;

public class BigDecimalUtilsIT {

    @Test
    public void shouldReturnTheFloatingPointValueUnchaged() {
        BigDecimal floatingPointValue = new BigDecimal(5.55123);
        BigDecimal result = BigDecimalUtils.toAtLeastOneFixedPoint(floatingPointValue);
        assertThat(result).isEqualTo(floatingPointValue);
    }

    @Test
    public void shouldReturnTheIntegerValueWithOneFixedPoint() {
        BigDecimal integerValue = new BigDecimal(2);
        BigDecimal result = BigDecimalUtils.toAtLeastOneFixedPoint(integerValue);
        assertThat(result.doubleValue()).isEqualTo(2.0);
    }

}
