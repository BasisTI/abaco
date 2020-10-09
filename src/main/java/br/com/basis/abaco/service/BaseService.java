package br.com.basis.abaco.service;

import br.com.basis.abaco.utils.StringUtils;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;

import static org.elasticsearch.index.query.QueryBuilders.*;

public class BaseService {

    protected void mustTermQuery(String valueField, BoolQueryBuilder qb, String nameField) {
        if (!StringUtils.isEmptyString((valueField))) {
            qb.must(QueryBuilders.termsQuery(nameField, valueField));
        }
    }

    protected void mustMatchPhaseQuery(String valueField, BoolQueryBuilder qb, String nameField) {
        if (!StringUtils.isEmptyString(valueField)) {
            qb.must(QueryBuilders.matchPhraseQuery(nameField, valueField));
        }
    }
    protected void mustMatchWildcardContainsQuery(String valueField, BoolQueryBuilder qb, String nameField) {
        if (!StringUtils.isEmptyString(valueField)) {
            qb.must(QueryBuilders.wildcardQuery(nameField, "*" + valueField + "*"));
        }
    }
    protected void mustMatchWildcardContainsQueryLowerCase(String valueField, BoolQueryBuilder qb, String nameField) {
        if (!StringUtils.isEmptyString(valueField)) {
            qb.must(QueryBuilders.wildcardQuery(nameField, "*" + valueField.toLowerCase() + "*"));
        }
    }

    protected void mustMatchQuery(String valueField, BoolQueryBuilder qb, String nameField) {
        if (!StringUtils.isEmptyString(valueField)) {
            qb.must(QueryBuilders.matchQuery(nameField, valueField));
        }
    }

    protected void mustMatchFuzzyQuery(String valueField, BoolQueryBuilder qb, String nameField) {
        if (!StringUtils.isEmptyString(valueField)) {
            qb.must(QueryBuilders.fuzzyQuery(nameField, valueField));
        }
    }

    protected void mustNestedTermQuery(String valueField, BoolQueryBuilder qb, String nameField, String nameArrayField) {
        if (!StringUtils.isEmptyString((valueField))) {
            qb.must(nestedQuery(nameArrayField, QueryBuilders.boolQuery().should(QueryBuilders.termQuery((nameArrayField + "." + nameField), valueField))));
        }
    }
}
