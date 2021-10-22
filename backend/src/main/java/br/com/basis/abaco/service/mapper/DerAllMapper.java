package br.com.basis.abaco.service.mapper;


import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.VwDer;
import br.com.basis.abaco.domain.VwDerAll;
import br.com.basis.abaco.repository.DerRepository;
import br.com.basis.abaco.service.EntityMapper;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class DerAllMapper implements EntityMapper<Der, VwDerAll>{

    private DerRepository derRepository;

    @Override
    public VwDerAll toEntity(Der dto) {
        VwDerAll vwDerAll = new VwDerAll();
        vwDerAll.setId(dto.getId());
        if(dto.getFuncaoDados() != null){
            vwDerAll.setFuncaoId(dto.getFuncaoDados().getId());
        }
        if(dto.getFuncaoTransacao() != null){
            vwDerAll.setFuncaoId(dto.getFuncaoTransacao().getId());
        }
        vwDerAll.setNome(dto.getNome());
        return vwDerAll;
    }

    @Override
    public Der toDto(VwDerAll entity) {
        Der der = new Der();
        der.setId(entity.getId());
        der.setNome(entity.getNome());
        return der;
    }

    @Override
    public List<VwDerAll> toEntity(List<Der> dtoList) {
        List<VwDerAll> vwDersAlls = new ArrayList<>();
        dtoList.forEach(item -> {
            Long idFuncao = null;
            if( item.getFuncaoDados() != null){
                idFuncao = item.getFuncaoDados().getId();
            }
            if(item.getFuncaoTransacao() != null){
                idFuncao = item.getFuncaoTransacao().getId();
            }
            VwDerAll vwDerAll = new VwDerAll(item.getId(), item.getNome(), idFuncao);
            vwDersAlls.add(vwDerAll);
        });
        return vwDersAlls;
    }

    @Override
    public List<Der> toDto(List<VwDerAll> entityList) {
        List<Der> ders = derRepository.findAll();
        return ders;
    }
}
