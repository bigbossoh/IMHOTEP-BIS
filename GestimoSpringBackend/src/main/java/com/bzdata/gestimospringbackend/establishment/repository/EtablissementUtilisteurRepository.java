package com.bzdata.gestimospringbackend.establishment.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.bzdata.gestimospringbackend.establishment.entity.EtablissementUtilisateur;

public interface EtablissementUtilisteurRepository extends JpaRepository<EtablissementUtilisateur,Long> {

    List<EtablissementUtilisateur> findAllByEtabl_Id(Long idEtablissement);

    List<EtablissementUtilisateur> findAllByUtilisateurEtabl_Id(Long idUtilisateur);

    Optional<EtablissementUtilisateur> findFirstByUtilisateurEtabl_IdAndEtableDefaultTrue(Long idUtilisateur);

    void deleteAllByUtilisateurEtabl_Id(Long idUtilisateur);
}
