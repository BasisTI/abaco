package br.com.basis.abaco.service.mapper;


import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.VwAlrAll;
import br.com.basis.abaco.repository.AlrRepository;
import br.com.basis.abaco.service.EntityMapper;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class AlrAllMapper implements EntityMapper<Alr, VwAlrAll>{

    private AlrRepository alrRepository;

    @Override
    public VwAlrAll toEntity(Alr dto) {
        VwAlrAll vwAlrAll = new VwAlrAll();
        vwAlrAll.setId(dto.getId());
        if(dto.getFuncaoTransacao() != null){
            vwAlrAll.setFuncaoId(dto.getFuncaoTransacao().getId());
        }
        vwAlrAll.setNome(dto.getNome());
        return vwAlrAll;
    }

    @Override
    public Alr toDto(VwAlrAll entity) {
        Alr alr = new Alr();
        alr.setId(entity.getId());
        alr.setNome(entity.getNome());
        return alr;
    }

    @Override
    public List<VwAlrAll> toEntity(List<Alr> dtoList) {
        List<VwAlrAll> vwAlrsAll = new ArrayList<>();
        dtoList.forEach(item -> {
            Long funcaoId = null;
            if(item.getFuncaoTransacao() != null){
                funcaoId = item.getFuncaoTransacao().getId();
            }
            VwAlrAll vwAlrAll = new VwAlrAll(funcaoId, item.getId(), item.getNome());
            vwAlrsAll.add(vwAlrAll);
        });
        return vwAlrsAll;
    }

    @Override
    public List<Alr> toDto(List<VwAlrAll> entityList) {
        List<Alr> alrs = alrRepository.findAll();
        return alrs;
    }
}
