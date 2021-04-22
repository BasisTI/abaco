import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ConfirmationService, FileUpload } from "primeng";
import { Upload } from "../upload/upload.model";


@Component({
    selector: 'app-arquivo-upload',
    host: {
        "(window:paste)": "handlePaste($event)"
    },
    templateUrl: './arquivo-upload.component.html'
})
export class ArquivoUploadComponent implements OnInit {

    @Input()
    arquivos: Upload[] = [];

    @Output()
    arquivosEvent = new EventEmitter<Upload[]>();

    @ViewChild(FileUpload) componenteFileEmLote: FileUpload;

    sanitizer: DomSanitizer

    lastObjectUrl: string = "";


    constructor(
        private confirmationService: ConfirmationService,
        sanitizer: DomSanitizer
    ) {
        this.sanitizer = sanitizer;
    }
    ngOnInit(): void {

    }

    onUploadEmLote(event) {
        for (let i = 0; i < event.currentFiles.length; i++) {
            let file: Upload = new Upload();
            file.originalName = event.currentFiles[i].name;
            file.logo = event.currentFiles[i];
            file.sizeOf = event.currentFiles[i].size;
            file.safeUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.currentFiles[i]));
            this.arquivos.push(file);
        }
        event.currentFiles = [];
        this.componenteFileEmLote.files = [];
        this.arquivosEvent.emit(this.arquivos);
    }

    confirmDeleteFileUpload(file: Upload) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir o arquivo?',
            accept: () => {
                this.arquivos.splice(this.arquivos.indexOf(file), 1);
                this.arquivosEvent.emit(this.arquivos);
            }
        });
    }

    public handlePaste(event: ClipboardEvent): void {
        let uploadFile = new Upload();
        let num: number = 0;
        var pastedImage = this.getPastedImage(event);
        if (!pastedImage) {
            return;
        }
        if (this.lastObjectUrl) {
            URL.revokeObjectURL(this.lastObjectUrl);
        }
        this.lastObjectUrl = URL.createObjectURL(pastedImage);
        num = this.arquivos.length + 1;
        uploadFile.originalName = "Evidência " + num;
        uploadFile.safeUrl = this.sanitizer.bypassSecurityTrustUrl(this.lastObjectUrl);
        uploadFile.logo = new File([event.clipboardData.files[0]], uploadFile.originalName, { type: event.clipboardData.files[0].type });
        uploadFile.sizeOf = event.clipboardData.files[0].size;

        this.arquivos.push(uploadFile);
        this.arquivosEvent.emit(this.arquivos);
    }

    private getPastedImage(event: ClipboardEvent): File | null {
        if (
            event.clipboardData &&
            event.clipboardData.files &&
            event.clipboardData.files.length &&
            this.isImageFile(event.clipboardData.files[0])
        ) {
            return (event.clipboardData.files[0]);
        }
        return (null);
    }

    private isImageFile(file: File): boolean {
        const res = file.type.search(/^image\//i) === 0;
        return (res);
    }
}
