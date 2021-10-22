package br.com.basis.abaco.service.mapper;


import br.com.basis.abaco.domain.Rlr;
import br.com.basis.abaco.domain.VwRlr;
import br.com.basis.abaco.domain.VwRlrAll;
import br.com.basis.abaco.repository.RlrRepository;
import br.com.basis.abaco.service.EntityMapper;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class RlrAllMapper implements EntityMapper<Rlr, VwRlrAll>{

    private RlrRepository rlrRepository;

    @Override
    public VwRlrAll toEntity(Rlr dto) {
        VwRlrAll vwRlrAll = new VwRlrAll();
        vwRlrAll.setId(dto.getId());
        if( dto.getFuncaoDados() != null){
            vwRlrAll.setFuncaoId(dto.getFuncaoDados().getId());
        }
        vwRlrAll.setNome(dto.getNome());
        return vwRlrAll;
    }

    @Override
    public Rlr toDto(VwRlrAll entity) {
        Rlr rlr = new Rlr();
        rlr.setId(entity.getId());
        rlr.setNome(entity.getNome());
        return rlr;
    }

    @Override
    public List<VwRlrAll> toEntity(List<Rlr> dtoList) {
        List<VwRlrAll> vwRlrsAlls = new ArrayList<>();
        dtoList.forEach(item -> {
            Long idFuncao = null;
            if( item.getFuncaoDados() != null){
                idFuncao = item.getFuncaoDados().getId();
            }
            VwRlrAll vwRlrAll = new VwRlrAll(item.getId(), item.getNome(), idFuncao);
            vwRlrsAlls.add(vwRlrAll);
        });
        return vwRlrsAlls;
    }

    @Override
    public List<Rlr> toDto(List<VwRlrAll> entityList) {
        List<Rlr> rlrs = rlrRepository.findAll();
        return rlrs;
    }
}
