export class ExportacaoUtil {
    static download(url, fileName: string) {
        const anchor = document.createElement('a');
        anchor.download = fileName;
        anchor.href = url;
        document.body.appendChild(anchor);
        anchor.click();
    }
}
