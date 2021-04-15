package br.com.basis.abaco.service.mapper;


import br.com.basis.abaco.domain.Alr;
import br.com.basis.abaco.domain.Rlr;
import br.com.basis.abaco.domain.VwAlr;
import br.com.basis.abaco.domain.VwRlr;
import br.com.basis.abaco.repository.AlrRepository;
import br.com.basis.abaco.repository.RlrRepository;
import br.com.basis.abaco.service.EntityMapper;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
public class AlrMapper implements EntityMapper<Alr, VwAlr>{

    private AlrRepository alrRepository;

    @Override
    public VwAlr toEntity(Alr dto) {
        VwAlr vwAlr = new VwAlr();
        vwAlr.setId(dto.getId());
        if(dto.getFuncaoDados() != null){
            vwAlr.setIdSistema(dto.getFuncaoTransacao().getFuncionalidade().getModulo().getSistema().getId());
        }
        vwAlr.setNome(dto.getNome());
        return vwAlr;
    }

    @Override
    public Alr toDto(VwAlr entity) {
        Alr alr = new Alr();
        alr.setId(entity.getId());
        alr.setNome(entity.getNome());
        return alr;
    }

    @Override
    public List<VwAlr> toEntity(List<Alr> dtoList) {
        List<VwAlr> vwAlrs = new ArrayList<>();
        dtoList.forEach(item -> {
            Long idSistema = null;
            if(item.getFuncaoTransacao() != null){
                idSistema = item.getFuncaoTransacao().getFuncionalidade().getModulo().getSistema().getId();
            }
            VwAlr vwAlr = new VwAlr(item.getId(), item.getNome(), idSistema);

            if(!vwAlrs.contains(vwAlr)){
                vwAlrs.add(vwAlr);
            }
        });
        return vwAlrs;
    }

    @Override
    public List<Alr> toDto(List<VwAlr> entityList) {
        List<Alr> alrs = alrRepository.findAll();
        return alrs;
    }
}
