package com.bzdata.gestimospringbackend.Models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class DepenseWorkflowConfig extends AbstractEntity {

  private Boolean active;
  private Double validationThreshold;
  private Integer levelCount;

  @Column(length = 4000)
  private String categoriesJson;

  @Column(length = 4000)
  private String paymentModesJson;

  private Boolean level1Active;
  private String level1Label;
  private String level1RoleName;
  private Long level1UserId;
  private String level1UserDisplayName;

  private Boolean level2Active;
  private String level2Label;
  private String level2RoleName;
  private Long level2UserId;
  private String level2UserDisplayName;

  private Boolean level3Active;
  private String level3Label;
  private String level3RoleName;
  private Long level3UserId;
  private String level3UserDisplayName;
}
