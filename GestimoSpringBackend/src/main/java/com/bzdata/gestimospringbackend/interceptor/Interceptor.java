package com.bzdata.gestimospringbackend.interceptor;

import org.hibernate.resource.jdbc.spi.StatementInspector;
import org.slf4j.MDC;
import org.springframework.util.StringUtils;

public class Interceptor implements StatementInspector {

  @Override
  public String inspect(String sql) {
    if (
      StringUtils.hasLength(sql) &&
      sql.toLowerCase().startsWith("select") &&
      (MDC.get("idAgence") != null)
    ) {
      final String entityName = sql.substring(7, sql.indexOf("."));
      final String idAgence = MDC.get("idAgence");

      if (
        StringUtils.hasLength(entityName) &&
        !idAgence.toLowerCase().contains("1001") &&
        !entityName.toLowerCase().contains("operation") &&
        !entityName.toLowerCase().contains("bail") &&
        !entityName.toLowerCase().contains("agence") &&
        !entityName.toLowerCase().contains("count") &&
        !entityName.toLowerCase().contains("coalesce") &&
        !entityName.toLowerCase().contains("pays") &&
        !entityName.toLowerCase().contains("ville0_") &&
        !entityName.toLowerCase().contains("commune") &&
        !entityName.toLowerCase().contains("role") &&
        !entityName.toLowerCase().contains("quartier") &&
        !entityName.toLowerCase().contains("site") &&
        !entityName.toLowerCase().contains("immeuble") &&
        !entityName.toLowerCase().contains("montantloy") &&
        !entityName.toLowerCase().contains("encaissement_princi") &&
        !entityName.toLowerCase().contains("imagedata") &&
        !entityName.toLowerCase().contains("filedata") &&
        !entityName.toLowerCase().contains("groupedro") &&
        !entityName.toLowerCase().contains("studio") &&
        !entityName.toLowerCase().contains("appartemen") &&
        !entityName.toLowerCase().contains("appelloye") &&
        StringUtils.hasLength(idAgence)
      ) {
        if (sql.contains("where")) {
          sql = sql + " and " + entityName + ".id_agence = " + idAgence;
        } else {
          sql = sql + " where " + entityName + ".id_agence = " + idAgence;
        }
      }
    }
    return sql;
  }
}
