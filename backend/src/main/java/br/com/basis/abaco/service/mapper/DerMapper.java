package br.com.basis.abaco.service.mapper;


import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.VwDer;
import br.com.basis.abaco.repository.DerRepository;
import br.com.basis.abaco.service.EntityMapper;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static br.com.basis.abaco.utils.AbacoUtil.distinctByKey;

@AllArgsConstructor
public class DerMapper implements EntityMapper<Der, VwDer>{

    private DerRepository derRepository;

    @Override
    public VwDer toEntity(Der dto) {
        VwDer vwDer = new VwDer();
        vwDer.setId(dto.getId());
        if(dto.getFuncaoDados() != null){
            vwDer.setIdSistemaFD(dto.getFuncaoDados().getFuncionalidade().getModulo().getSistema().getId());
        }
        if(dto.getFuncaoTransacao() != null){
            vwDer.setIdSistemaFT(dto.getFuncaoTransacao().getFuncionalidade().getModulo().getSistema().getId());
        }
        vwDer.setNome(dto.getNome());
        return vwDer;
    }

    @Override
    public Der toDto(VwDer entity) {
        Der der = new Der();
        der.setId(entity.getId());
        der.setNome(entity.getNome());
        return der;
    }

    @Override
    public List<VwDer> toEntity(List<Der> dtoList) {
        List<VwDer> vwDers = new ArrayList<>();
        dtoList.forEach(item -> {
            Long idFD = null;
            Long idFT = null;
            if(item.getFuncaoDados() != null){
                idFD = item.getFuncaoDados().getFuncionalidade().getModulo().getSistema().getId();
            }
            if(item.getFuncaoTransacao() != null){
                idFT = item.getFuncaoTransacao().getFuncionalidade().getModulo().getSistema().getId();
            }
            VwDer vwDer = new VwDer(item.getId(), item.getNome(), idFD, idFT);

            if(!vwDers.contains(vwDer)){
                vwDers.add(vwDer);
            }
        });
        return vwDers;
    }

    @Override
    public List<Der> toDto(List<VwDer> entityList) {
        List<Der> ders = derRepository.findAll();
        return ders;
    }
}
