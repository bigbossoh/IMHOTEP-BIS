package com.bzdata.gestimospringbackend.newCertificationWay;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;

@Component
public class InvoiceResponseParser {

    public InvoiceMainResponse parse(JsonNode root) {
        InvoiceMainResponse main = new InvoiceMainResponse();
        main.setNcc(text(root, "ncc"));
        main.setReference(text(root, "reference"));
        main.setToken(text(root, "token"));
        main.setWarning(root.path("warning").asBoolean(false));
        main.setBalanceFunds(intValue(root, "balance_funds"));

        JsonNode invNode = root.path("invoice");
        if (!invNode.isMissingNode() && !invNode.isNull()) {
            main.setInvoice(parseInvoice(invNode));
        }
        return main;
    }

    private InvoiceFneCertify parseInvoice(JsonNode inv) {
        InvoiceFneCertify i = new InvoiceFneCertify();

        i.setId(text(inv, "id"));
        i.setParentId(textOrNull(inv, "parentId"));
        i.setParentReference(textOrNull(inv, "parentReference"));

        i.setToken(text(inv, "token"));
        i.setReference(text(inv, "reference"));

        i.setType(text(inv, "type"));
        i.setSubtype(text(inv, "subtype"));

        i.setDate(date(inv, "date"));
        i.setPaymentMethod(text(inv, "paymentMethod"));

        i.setAmount(longValue(inv, "amount"));
        i.setVatAmount(longValue(inv, "vatAmount"));
        i.setFiscalStamp(longValue(inv, "fiscalStamp"));
        i.setDiscount(intValue(inv, "discount"));

        i.setTotalBeforeTaxes(longValue(inv, "totalBeforeTaxes"));
        i.setTotalDiscounted(longValue(inv, "totalDiscounted"));
        i.setTotalTaxes(longValue(inv, "totalTaxes"));
        i.setTotalAfterTaxes(longValue(inv, "totalAfterTaxes"));
        i.setTotalCustomTaxes(longValue(inv, "totalCustomTaxes"));
        i.setTotalDue(longValue(inv, "totalDue"));

        i.setClientNcc(text(inv, "clientNcc"));
        i.setClientCompanyName(text(inv, "clientCompanyName"));
        i.setClientPhone(text(inv, "clientPhone"));
        i.setClientEmail(text(inv, "clientEmail"));

        i.setClientTerminal(textOrNull(inv, "clientTerminal"));
        i.setClientMerchantName(textOrNull(inv, "clientMerchantName"));
        i.setClientRccm(textOrNull(inv, "clientRccm"));
        i.setClientSellerName(textOrNull(inv, "clientSellerName"));
        i.setClientEstablishment(text(inv, "clientEstablishment"));
        i.setClientPointOfSale(text(inv, "clientPointOfSale"));
        i.setClientTaxRegime(text(inv, "clientTaxRegime"));

        i.setStatus(text(inv, "status"));
        i.setTemplate(text(inv, "template"));

        i.setDescription(textOrNull(inv, "description"));
        i.setFooter(textOrNull(inv, "footer"));
        i.setCommercialMessage(text(inv, "commercialMessage"));

        i.setForeignCurrency(textOrNull(inv, "foreignCurrency"));
        i.setForeignCurrencyRate(intValueNullable(inv, "foreignCurrencyRate"));

        i.setIsRne(boolNullable(inv, "isRne"));
        i.setRne(textOrNull(inv, "rne"));

        i.setSource(text(inv, "source"));

        i.setCreatedAt(date(inv, "createdAt"));
        i.setUpdatedAt(date(inv, "updatedAt"));

        // items
        List<Item> items = new ArrayList<>();
        JsonNode itemsNode = inv.path("items");
        if (itemsNode.isArray()) {
            for (JsonNode it : itemsNode) {
                items.add(parseItem(it));
            }
        }
        i.setItems(items);

        // customTaxes invoice
        List<InvoiceCertifierCustomTax> invoiceCustomTaxes = new ArrayList<>();
        JsonNode ctNode = inv.path("customTaxes");
        if (ctNode.isArray()) {
            for (JsonNode t : ctNode) {
                InvoiceCertifierCustomTax tax = new InvoiceCertifierCustomTax();
                tax.setId(textOrNull(t, "id"));
                tax.setInvoiceId(textOrNull(t, "invoiceId"));
                tax.setAmount(intValueNullable(t, "amount"));
                tax.setName(textOrNull(t, "name"));
                tax.setCreatedAt(date(t, "createdAt"));
                tax.setUpdatedAt(date(t, "updatedAt"));
                invoiceCustomTaxes.add(tax);
            }
        }
        i.setCustomTaxes(invoiceCustomTaxes);

        return i;
    }

    private Item parseItem(JsonNode it) {
        Item item = new Item();
        item.setId(text(it, "id"));
        item.setQuantity(intValue(it, "quantity"));
        item.setReference(textOrNull(it, "reference"));
        item.setDescription(text(it, "description"));
        item.setAmount(longValue(it, "amount"));
        item.setDiscount(intValueNullable(it, "discount"));
        item.setMeasurementUnit(textOrNull(it, "measurementUnit"));
        item.setCreatedAt(date(it, "createdAt"));
        item.setUpdatedAt(date(it, "updatedAt"));
        item.setInvoiceId(textOrNull(it, "invoiceId"));
        item.setParentId(textOrNull(it, "parentId"));

        // taxes
        List<ItemTax> taxes = new ArrayList<>();
        JsonNode taxesNode = it.path("taxes");
        if (taxesNode.isArray()) {
            for (JsonNode tx : taxesNode) {
                ItemTax t = new ItemTax();
                t.setInvoiceItemId(text(tx, "invoiceItemId"));
                t.setVatRateId(text(tx, "vatRateId"));
                t.setAmount(intValue(tx, "amount"));
                t.setName(text(tx, "name"));
                t.setShortName(text(tx, "shortName"));
                t.setCreatedAt(date(tx, "createdAt"));
                t.setUpdatedAt(date(tx, "updatedAt"));
                taxes.add(t);
            }
        }
        item.setTaxes(taxes);

        // custom taxes item
        List<ItemCustomTax> customTaxes = new ArrayList<>();
        JsonNode cNode = it.path("customTaxes");
        if (cNode.isArray()) {
            for (JsonNode ct : cNode) {
                ItemCustomTax t = new ItemCustomTax();
                t.setId(textOrNull(ct, "id"));
                t.setInvoiceItemId(textOrNull(ct, "invoiceItemId"));
                t.setAmount(intValueNullable(ct, "amount"));
                t.setName(textOrNull(ct, "name"));
                t.setCreatedAt(date(ct, "createdAt"));
                t.setUpdatedAt(date(ct, "updatedAt"));
                customTaxes.add(t);
            }
        }
        item.setCustomTaxes(customTaxes);

        return item;
    }

    // ===== Helpers safe =====

    private String text(JsonNode node, String field) {
        JsonNode v = node.get(field);
        if (v == null || v.isNull()) return null;
        String s = v.asText();
        return "null".equalsIgnoreCase(s) ? null : s;
    }

    private String textOrNull(JsonNode node, String field) {
        return text(node, field);
    }

    private Integer intValue(JsonNode node, String field) {
        JsonNode v = node.get(field);
        if (v == null || v.isNull()) return 0;
        return v.asInt();
    }

    private Integer intValueNullable(JsonNode node, String field) {
        JsonNode v = node.get(field);
        if (v == null || v.isNull()) return null;
        return v.asInt();
    }

    private Long longValue(JsonNode node, String field) {
        JsonNode v = node.get(field);
        if (v == null || v.isNull()) return 0L;
        return v.asLong();
    }

    private Boolean boolNullable(JsonNode node, String field) {
        JsonNode v = node.get(field);
        if (v == null || v.isNull()) return null;
        return v.asBoolean();
    }

    private OffsetDateTime date(JsonNode node, String field) {
        String s = text(node, field);
        if (s == null || s.isBlank()) return null;
        return OffsetDateTime.parse(s);
    }
}
