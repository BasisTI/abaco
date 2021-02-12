package br.com.basis.abaco.service.mapper;

import br.com.basis.abaco.domain.User;
import br.com.basis.abaco.service.EntityMapper;
import br.com.basis.abaco.service.dto.UserEditDTO;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.stream.Collectors;

public class UserElasticSearchMapper implements EntityMapper<UserEditDTO, User> {

    private ModelMapper modelMapper = new ModelMapper();

    @Override
    public User toEntity(UserEditDTO dto) {
        return modelMapper.map(dto, User.class);
    }

    @Override
    public UserEditDTO toDto(User entity) {
        return modelMapper.map(entity, UserEditDTO.class);
    }

    @Override
    public List<User> toEntity(List<UserEditDTO> dtoList) {
        return dtoList.stream()
            .map(this::toEntity)
            .collect(Collectors.toList());
    }

    @Override
    public List<UserEditDTO> toDto(List<User> entityList) {
        return entityList.stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }
}
