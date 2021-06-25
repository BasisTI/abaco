package br.com.basis.abaco.service;

import br.com.basis.abaco.domain.FuncaoTransacao;
import br.com.basis.abaco.domain.UploadedFile;
import br.com.basis.abaco.repository.FuncaoTransacaoRepository;
import br.com.basis.abaco.repository.UploadedFilesRepository;
import br.com.basis.abaco.web.rest.errors.UploadException;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.bind.DatatypeConverter;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class FuncaoTransacaoService {

}
