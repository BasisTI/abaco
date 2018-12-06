package br.com.basis.abaco.reports.rest;

import br.com.basis.abaco.domain.BaseLineAnalitico;
import br.com.basis.abaco.domain.BaseLineSintetico;
import br.com.basis.abaco.reports.util.RelatorioUtil;
import br.com.basis.abaco.service.dto.BaselineDTO;
import net.sf.jasperreports.engine.JRException;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RelatorioBaselineRest {

    private static String caminhoRelatorioBaseline = "reports/analise/baseline.jasper";

    private static String caminhoImagem = "reports/img/fnde_logo.png";

    private HttpServletRequest request;

    private HttpServletResponse response;

    private Map<String, Object> parametro;

    private RelatorioUtil relatorio;

    private BaselineDTO objeto;

    /**
     *
     * @param response
     * @param request
     */
    public RelatorioBaselineRest(HttpServletResponse response, HttpServletRequest request) {
        this.response = response;
        this.request = request;
    }

    /**
     *
     */
    private void init() {
        relatorio = new RelatorioUtil( this.response, this.request);
    }

    /**
     *
     * @param baseLineSintetico
     * @return
     * @throws FileNotFoundException
     * @throws JRException
     */
    public @ResponseBody byte[] downloadPdfBaselineBrowser(BaseLineSintetico baseLineSintetico, List<BaseLineAnalitico> baselineFds, List<BaseLineAnalitico> baselineFts) throws FileNotFoundException, JRException {
        init();
        return relatorio.downloadPdfBaselineBrowser(caminhoRelatorioBaseline, popularBaseline(baseLineSintetico, baselineFds, baselineFts));
    }

    /**
     *
     * @return
     */
    private Map<String, Object> popularBaseline(BaseLineSintetico baseLineSintetico, List<BaseLineAnalitico> baselineFds, List<BaseLineAnalitico> baselineFts) {
        parametro = new HashMap<String, Object>();
        this.popularImagemRelatorio();
        this.popularParametroSistema(baseLineSintetico);
        this.popularListaBaseLineFD(baselineFds);
        this.popularListaBaseLineFT(baselineFts);
        return parametro;
    }

    /**
     * Método responsável por acessar o caminho da imagem da logo do relatório e popular o parâmetro.
    */
    private void popularImagemRelatorio() {
        InputStream reportStream = getClass().getClassLoader().getResourceAsStream(caminhoImagem);
        parametro.put("IMAGEMLOGO", reportStream);
    }

    /**
     * Método responsável por popular a lista de FDs da baseline.
     * @param baselineFds
     */
    private void popularListaBaseLineFD(List<BaseLineAnalitico> baselineFds) {
        List<BaselineDTO> listBaselineFdsDTO = new ArrayList<>();
        for(BaseLineAnalitico a : baselineFds) {
            objeto = new BaselineDTO();

            objeto.setNome(a.getName());
            objeto.setClassificacao(a.getClassificacao());
            objeto.setRlr(a.getRlralr().toString());
            objeto.setDer(a.getDer().toString());
            objeto.setComplexidade(a.getComplexidade());
            objeto.setPf(a.getPf().toString());

            listBaselineFdsDTO.add(objeto); }

        this.popularParametroBaselineFDs(listBaselineFdsDTO);
    }
    /**
     * Método responsável por popular a lista de FTs da baseline.
     * @param baselineFts
     */
    private void popularListaBaseLineFT(List<BaseLineAnalitico> baselineFts) {
        List<BaselineDTO> listBaselineFtsDTO = new ArrayList<>();
        for(BaseLineAnalitico a : baselineFts) {
            objeto = new BaselineDTO();

            objeto.setDer(a.getDer().toString());
            objeto.setComplexidade(a.getComplexidade());
            objeto.setPf(a.getPf().toString());
            objeto.setNome(a.getName());
            objeto.setClassificacao(a.getClassificacao());
            objeto.setRlr(a.getRlralr().toString());

            listBaselineFtsDTO.add(objeto); }

        this.popularParametroBaselineFTs(listBaselineFtsDTO);
    }

    /**
     *
     * @param baseLineSintetico
     */
    private void popularParametroSistema(BaseLineSintetico baseLineSintetico) {
        parametro.put("SISTEMANM", baseLineSintetico.getNome());
        parametro.put("NUMOCORRENCIA", baseLineSintetico.getNumeroocorrencia());
        parametro.put("PFTOTAL", baseLineSintetico.getSum().toString());
    }

    /**
     *
     * @param listBaseline
     */
    private void popularParametroBaselineFDs(List<BaselineDTO> listBaseline) {
        parametro.put("LISTAFDS", listBaseline);
    }

    private void popularParametroBaselineFTs(List<BaselineDTO> listBaseline) {
        parametro.put("LISTAFTS", listBaseline);
    }


}
