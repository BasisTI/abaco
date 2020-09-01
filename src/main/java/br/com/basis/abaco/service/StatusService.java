package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.Status;
import br.com.basis.abaco.repository.StatusRepository;
import br.com.basis.abaco.repository.search.StatusSearchRepository;
import br.com.basis.abaco.service.dto.StatusDTO;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StatusService {

    private final StatusRepository statusRepository;
    private final StatusSearchRepository statusSearchRepository;

    public StatusService(StatusRepository statusRepository, StatusSearchRepository statusSearchRepository) {
        this.statusRepository = statusRepository;
        this.statusSearchRepository = statusSearchRepository;
    }

    @Transactional(readOnly = true)
    public List<br.com.basis.abaco.service.dto.DropdownDTO> getStatusDropdown() {
        return statusRepository.getDropdown();
    }
    public StatusDTO save(StatusDTO statusDTO) {
        Status status = convertToEntity(statusDTO);
        Status result = statusRepository.save(status);
        statusSearchRepository.save(result);
        return convertToDto(status);
    }


    public List<Status> findAllActive() {
        return statusRepository.findByAtivoTrue();
    }

    public List<Status> findAll() {
        return statusRepository.findAll();
    }

    public StatusDTO convertToDto(Status status) {
        return new ModelMapper().map(status, StatusDTO.class);
    }

    public Status convertToEntity(StatusDTO statusDTO) {
        return new ModelMapper().map(statusDTO, Status.class);
    }

    public Status setEntityToElatischSearch(Status status){
        return convertToEntity(convertToDto(status));
    }
    public List<StatusDTO> convert(List<Status> lstStatus) {
        return lstStatus.stream().map(this::convertToDto)
            .collect(Collectors.toList());
    }
}
