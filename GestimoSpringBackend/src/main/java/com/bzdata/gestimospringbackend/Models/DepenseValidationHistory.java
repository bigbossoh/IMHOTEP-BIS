package com.bzdata.gestimospringbackend.Models;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class DepenseValidationHistory extends AbstractEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  private SuivieDepense suivieDepense;

  private Integer validationLevel;
  private String actionType;
  private String workflowStatusAfterAction;
  private Long actorUserId;
  private String actorName;
  private String actorRoleName;

  @Column(length = 2000)
  private String commentaire;

  private Instant actionAt;
}
