package br.com.basis.abaco.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import br.com.basis.abaco.domain.Der;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.basis.abaco.repository.DerRepository;
import br.com.basis.abaco.service.dto.DropdownDTO;

@Service
@Transactional
public class DerService {

    private final DerRepository derRepository;

    public DerService(DerRepository derRepository) {
        this.derRepository = derRepository;
    }

    @Transactional(readOnly = true)
    public List<DropdownDTO> getDerByFuncaoDadosIdDropdown(Long idFuncaoDados) {
       List<DropdownDTO> lstDersDrop = new ArrayList<>();
        List<Der> lstDers = derRepository.getDerByFuncaoDadosIdDropdown(idFuncaoDados);
        lstDers.forEach(der -> {
            DropdownDTO dropdownDer;
            if(der.getNome() == null || der.getNome().isEmpty()){
                dropdownDer = new br.com.basis.abaco.service.dto.DropdownDTO(der.getId(),der.getValor().toString());
            }else {
                dropdownDer = new br.com.basis.abaco.service.dto.DropdownDTO(der.getId(),der.getNome());
            }
            lstDersDrop.add(dropdownDer);
        });
        return lstDersDrop;
    }

}
