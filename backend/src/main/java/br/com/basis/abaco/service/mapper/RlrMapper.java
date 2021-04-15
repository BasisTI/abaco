package br.com.basis.abaco.service.mapper;


import br.com.basis.abaco.domain.Der;
import br.com.basis.abaco.domain.Rlr;
import br.com.basis.abaco.domain.VwDer;
import br.com.basis.abaco.domain.VwRlr;
import br.com.basis.abaco.repository.DerRepository;
import br.com.basis.abaco.repository.RlrRepository;
import br.com.basis.abaco.service.EntityMapper;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class RlrMapper implements EntityMapper<Rlr, VwRlr>{

    private RlrRepository rlrRepository;

    @Override
    public VwRlr toEntity(Rlr dto) {
        VwRlr vwRlr = new VwRlr();
        vwRlr.setId(dto.getId());
        if(dto.getFuncaoDados() != null){
            vwRlr.setIdSistema(dto.getFuncaoDados().getFuncionalidade().getModulo().getSistema().getId());
        }
        vwRlr.setNome(dto.getNome());
        return vwRlr;
    }

    @Override
    public Rlr toDto(VwRlr entity) {
        Rlr rlr = new Rlr();
        rlr.setId(entity.getId());
        rlr.setNome(entity.getNome());
        return rlr;
    }

    @Override
    public List<VwRlr> toEntity(List<Rlr> dtoList) {
        List<VwRlr> vwRlrs = new ArrayList<>();
        dtoList.forEach(item -> {
            Long idSistema = null;
            if(item.getFuncaoDados() != null){
                idSistema = item.getFuncaoDados().getFuncionalidade().getModulo().getSistema().getId();
            }
            VwRlr vwRlr = new VwRlr(item.getId(), item.getNome(), idSistema);

            if(!vwRlrs.contains(vwRlr)){
                vwRlrs.add(vwRlr);
            }
        });
        return vwRlrs;
    }

    @Override
    public List<Rlr> toDto(List<VwRlr> entityList) {
        List<Rlr> rlrs = rlrRepository.findAll();
        return rlrs;
    }
}
