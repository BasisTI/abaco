export default function Base64UploaderPlugin( editor ) {
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
        return new UploadAdapter(loader, editor.t);
    };
}

/**
 * Adaptador de Upload para Base64.
 *
 * @private
 * @implements module:upload/filerepository~UploadAdapter
 */
class UploadAdapter {
	/**
	 * Cria uma nova instância de adaptador.
	 *
	 * @param {module:upload/filerepository~FileLoader} loader
	 * @param {module:utils/locale~Locale#t} t
	 */
	constructor(loader, t) {
		/**
		 * FileLoader instância para uso durante o upload.
		 *
		 * @member {module:upload/filerepository~FileLoader} #loader
		 */
		this.loader = loader;

		/**
		 * Locale translation method.
		 *
		 * @member {module:utils/locale~Locale#t} #t
		 */
		this.t = t;
	}

	/**
	 * Inicia o processo de upload.
	 *
	 * @see module:upload/filerepository~UploadAdapter#upload
	 * @returns {Promise}
	 */
	upload() {
		return new Promise((resolve, reject) => {
			const reader = this.reader = new FileReader();

			reader.onload = function () {
				resolve({ default: reader.result });
			};

			reader.onerror = function (error) {
				reject(error);
			};

			reader.onabort = function () {
				reject();
			};

			this.loader.file.then(file => {
                reader.readAsDataURL(file);
            });
		});
	}

	/**
	 * Aborta o processo de upload.
	 *
	 * @see module:upload/filerepository~UploadAdapter#abort
	 * @returns {Promise}
	 */
	abort() {
		if (this.reader) {
			this.reader.abort();
		}
	}
}