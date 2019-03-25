package br.com.basis.abaco.repository;

import br.com.basis.abaco.domain.Modulo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * Spring Data JPA repository for the Modulo entity.
 */
@SuppressWarnings("unused")
public interface ModuloRepository extends JpaRepository<Modulo, Long> {

    @Query(value = "SELECT * FROM modulo m WHERE m.id = (" +
                                        "SELECT modulo_id FROM funcionalidade WHERE id = ?1" +
                                    ")",
        nativeQuery = true)
    public Modulo findByFuncionalidade(Long id);

}
