package br.com.basis.abaco.utils;

import java.math.BigDecimal;

public class BigDecimalUtils {

    // WORKAROUND para o bug do elasticsearch
    // https://github.com/elastic/elasticsearch/issues/15961#issuecomment-171631059
    public static BigDecimal toAtLeastOneFixedPoint(BigDecimal value) {
        if (isIntegerValue(value)) {
            return value.setScale(1);
        }
        return value;
    }

    private static boolean isIntegerValue(BigDecimal bd) {
        return bd.signum() == 0 || bd.scale() <= 0 || bd.stripTrailingZeros().scale() <= 0;
    }

}
