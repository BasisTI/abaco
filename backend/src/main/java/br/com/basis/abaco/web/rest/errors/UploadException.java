package br.com.basis.abaco.web.rest.errors;

/**
 * Exception thrown when an error occurs during upload
 */
public class UploadException extends RuntimeException {

    public UploadException(String message, Throwable cause) {
        super(message, cause);
    }
}
